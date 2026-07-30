import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchGames, type IRawgClient, type ICheapSharkClient } from '../../src/application/use-cases/SearchGames';
import { UpstreamError } from '../../src/domain/errors/UpstreamError';
import type { Game } from '../../src/domain/entities/Game';
import type { Deal } from '../../src/domain/entities/Deal';

// ── fixtures ────────────────────────────────────────────────────────────────
const rawgGame: Omit<Game, 'deals'> = {
  id: 'the-witcher-3-wild-hunt',
  title: 'The Witcher 3 Wild Hunt',
  coverImage: 'https://media.rawg.io/img.jpg',
  rating: 4.66,
  releaseDate: '2015-05-18',
  genres: ['RPG', 'Adventure'],
};

const deals: Deal[] = [
  {
    store: 'GOG',
    price: 9.99,
    originalPrice: 39.99,
    currency: 'USD',
    discountPercentage: 75,
    dealUrl: 'https://www.cheapshark.com/redirect?dealID=ABC',
  },
];

// ── helpers ──────────────────────────────────────────────────────────────────
function makeRawg(override?: Partial<IRawgClient>): IRawgClient {
  return {
    searchByTitle: vi.fn().mockResolvedValue([rawgGame]),
    ...override,
  };
}

function makeCheapShark(override?: Partial<ICheapSharkClient>): ICheapSharkClient {
  return {
    searchByTitle: vi.fn().mockResolvedValue([
      { gameId: '12345', title: 'The Witcher 3 Wild Hunt', thumb: 'https://thumb.jpg' },
    ]),
    getDealsForGame: vi.fn().mockResolvedValue(deals),
    ...override,
  };
}

// ── tests ────────────────────────────────────────────────────────────────────
describe('SearchGames.execute', () => {
  let useCase: SearchGames;

  beforeEach(() => {
    useCase = new SearchGames(makeRawg(), makeCheapShark());
  });

  it('fusiona metadatos RAWG con deals CheapShark por slug', async () => {
    const result = await useCase.execute({ title: 'witcher', limit: 5 });

    expect(result.sources).toContain('rawg');
    expect(result.sources).toContain('cheapshark');
    expect(result.games).toHaveLength(1);

    const game = result.games[0]!;
    expect(game.rating).toBe(4.66);
    expect(game.genres).toEqual(['RPG', 'Adventure']);
    expect(game.deals).toEqual(deals);
  });

  it('cuando solo RAWG falla, responde con deals vacíos y sources=["cheapshark"]', async () => {
    useCase = new SearchGames(
      makeRawg({ searchByTitle: vi.fn().mockRejectedValue(new Error('RAWG down')) }),
      makeCheapShark(),
    );

    const result = await useCase.execute({ title: 'witcher', limit: 5 });

    expect(result.sources).toEqual(['cheapshark']);
    expect(result.games[0]?.deals).toEqual(deals);
    expect(result.games[0]?.rating).toBeNull();
  });

  it('cuando solo CheapShark falla, responde con deals vacíos y sources=["rawg"]', async () => {
    useCase = new SearchGames(
      makeRawg(),
      makeCheapShark({ searchByTitle: vi.fn().mockRejectedValue(new Error('CS down')) }),
    );

    const result = await useCase.execute({ title: 'witcher', limit: 5 });

    expect(result.sources).toEqual(['rawg']);
    expect(result.games[0]?.deals).toEqual([]);
    expect(result.games[0]?.rating).toBe(4.66);
  });

  it('cuando ambas fuentes fallan, lanza UpstreamError', async () => {
    useCase = new SearchGames(
      makeRawg({ searchByTitle: vi.fn().mockRejectedValue(new Error('RAWG down')) }),
      makeCheapShark({ searchByTitle: vi.fn().mockRejectedValue(new Error('CS down')) }),
    );

    await expect(useCase.execute({ title: 'witcher', limit: 5 })).rejects.toBeInstanceOf(
      UpstreamError,
    );
  });

  it('deals vacíos cuando getDealsForGame falla para un juego específico', async () => {
    useCase = new SearchGames(
      makeRawg(),
      makeCheapShark({ getDealsForGame: vi.fn().mockRejectedValue(new Error('timeout')) }),
    );

    const result = await useCase.execute({ title: 'witcher', limit: 5 });

    expect(result.games[0]?.deals).toEqual([]);
  });

  it('limita los resultados según el parámetro limit', async () => {
    const rawg = makeRawg({
      searchByTitle: vi.fn().mockResolvedValue([rawgGame, { ...rawgGame, id: 'witcher-2', title: 'Witcher 2' }]),
    });
    const cs = makeCheapShark({ searchByTitle: vi.fn().mockResolvedValue([]) });

    useCase = new SearchGames(rawg, cs);
    const result = await useCase.execute({ title: 'witcher', limit: 1 });

    expect(result.games.length).toBeLessThanOrEqual(1);
  });
});
