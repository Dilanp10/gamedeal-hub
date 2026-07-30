import type { Game } from '../../domain/entities/Game';
import { UpstreamError } from '../../domain/errors/UpstreamError';
import { type RawgGameDto, mapRawgGame } from '../mappers/RawgGameMapper';

interface RawgSearchResponse {
  results: RawgGameDto[];
}

export class RawgClient {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
    private readonly timeoutMs: number,
  ) {}

  async searchByTitle(title: string, limit: number): Promise<Array<Omit<Game, 'deals'>>> {
    const url = `${this.baseUrl}/games?search=${encodeURIComponent(title)}&page_size=${limit}&key=${this.apiKey}`;
    const data = await this.fetchJson<RawgSearchResponse>(url);
    return data.results.map(mapRawgGame);
  }

  private async fetchJson<T>(url: string): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      response = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'GameDealHub/1.0' },
      });
    } catch (err) {
      throw new UpstreamError(
        `Error de red al contactar RAWG: ${err instanceof Error ? err.message : String(err)}`,
        'rawg',
      );
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      throw new UpstreamError(
        `RAWG respondió con status ${response.status}`,
        'rawg',
      );
    }

    return response.json() as Promise<T>;
  }
}
