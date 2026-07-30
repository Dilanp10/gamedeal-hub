import type { Game } from '../../domain/entities/Game';
import type { Deal } from '../../domain/entities/Deal';
import { UpstreamError } from '../../domain/errors/UpstreamError';
import { slugify } from '../../shared/slugify';
import { logger } from '../../shared/logger';

// Puertos: el use case depende de estas abstracciones, no de implementaciones concretas.
export interface IRawgClient {
  searchByTitle(title: string, limit: number): Promise<Array<Omit<Game, 'deals'>>>;
}

export interface CheapSharkGameSummary {
  gameId: string;
  title: string;
  thumb: string;
}

export interface ICheapSharkClient {
  searchByTitle(title: string, limit: number): Promise<CheapSharkGameSummary[]>;
  getDealsForGame(gameId: string): Promise<Deal[]>;
}

export interface SearchGamesResult {
  games: Game[];
  sources: Array<'rawg' | 'cheapshark'>;
}

export class SearchGames {
  constructor(
    private readonly rawgClient: IRawgClient,
    private readonly cheapSharkClient: ICheapSharkClient,
  ) {}

  async execute(params: { title: string; limit: number }): Promise<SearchGamesResult> {
    const { title, limit } = params;

    const [rawgResult, csResult] = await Promise.allSettled([
      this.rawgClient.searchByTitle(title, limit),
      this.cheapSharkClient.searchByTitle(title, limit),
    ]);

    if (rawgResult.status === 'rejected' && csResult.status === 'rejected') {
      logger.error('Ambas fuentes fallaron', { title });
      throw new UpstreamError(
        'No se pudo obtener información de ninguna fuente externa.',
        'all',
      );
    }

    const sources: Array<'rawg' | 'cheapshark'> = [];
    const gameMap = new Map<string, Game>();

    // --- RAWG ---
    if (rawgResult.status === 'fulfilled') {
      sources.push('rawg');
      for (const partial of rawgResult.value) {
        gameMap.set(slugify(partial.title), { ...partial, deals: [] });
      }
    } else {
      logger.warn('RAWG falló, continuando solo con CheapShark', {
        error: (rawgResult.reason as Error).message,
      });
    }

    // --- CheapShark ---
    if (csResult.status === 'fulfilled') {
      sources.push('cheapshark');
      const csGames = csResult.value.slice(0, limit);

      const dealResults = await Promise.allSettled(
        csGames.map((csg) => this.cheapSharkClient.getDealsForGame(csg.gameId)),
      );

      for (let i = 0; i < csGames.length; i++) {
        const csg = csGames[i];
        const dealResult = dealResults[i];
        if (!csg || !dealResult) continue;

        const deals = dealResult.status === 'fulfilled' ? dealResult.value : [];
        if (dealResult.status === 'rejected') {
          logger.warn(`No se pudieron obtener deals para gameId=${csg.gameId}`);
        }

        const slug = slugify(csg.title);
        const existing = gameMap.get(slug);

        if (existing) {
          existing.deals = deals;
        } else {
          gameMap.set(slug, {
            id: slug,
            title: csg.title,
            coverImage: csg.thumb || null,
            rating: null,
            releaseDate: null,
            genres: [],
            deals,
          });
        }
      }
    } else {
      logger.warn('CheapShark falló, los juegos no tendrán precios', {
        error: (csResult.reason as Error).message,
      });
    }

    return {
      games: Array.from(gameMap.values()).slice(0, limit),
      sources,
    };
  }
}
