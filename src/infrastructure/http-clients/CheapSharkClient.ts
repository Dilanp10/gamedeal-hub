import type { Deal } from '../../domain/entities/Deal';
import { UpstreamError } from '../../domain/errors/UpstreamError';
import { type CheapSharkDealDto, mapCheapSharkDeal } from '../mappers/CheapSharkDealMapper';

interface CheapSharkGameSummaryDto {
  gameID: string;
  external: string;
  cheapest: string;
  thumb: string;
}

interface CheapSharkGameDetailDto {
  info: { title: string; thumb: string };
  deals: CheapSharkDealDto[];
}

interface CheapSharkStoreDto {
  storeID: string;
  storeName: string;
  isActive: number;
}

export type CheapSharkGameSummary = {
  gameId: string;
  title: string;
  thumb: string;
};

export class CheapSharkClient {
  private storeMapPromise: Promise<Map<string, string>> | null = null;

  constructor(
    private readonly baseUrl: string,
    private readonly timeoutMs: number,
  ) {}

  async searchByTitle(title: string, limit: number): Promise<CheapSharkGameSummary[]> {
    const url = `${this.baseUrl}/games?title=${encodeURIComponent(title)}&limit=${limit}`;
    const results = await this.fetchJson<CheapSharkGameSummaryDto[]>(url);
    return results.map((r) => ({ gameId: r.gameID, title: r.external, thumb: r.thumb }));
  }

  async getDealsForGame(gameId: string): Promise<Deal[]> {
    const [detail, storeMap] = await Promise.all([
      this.fetchJson<CheapSharkGameDetailDto>(`${this.baseUrl}/games?id=${gameId}`),
      this.getStoreMap(),
    ]);
    return detail.deals
      .map((d) => mapCheapSharkDeal(d, storeMap))
      .sort((a, b) => a.price - b.price);
  }

  private getStoreMap(): Promise<Map<string, string>> {
    if (!this.storeMapPromise) {
      this.storeMapPromise = this.buildStoreMap().catch((err: unknown) => {
        this.storeMapPromise = null;
        throw err;
      });
    }
    return this.storeMapPromise;
  }

  private async buildStoreMap(): Promise<Map<string, string>> {
    const stores = await this.fetchJson<CheapSharkStoreDto[]>(`${this.baseUrl}/stores`);
    return new Map(
      stores.filter((s) => s.isActive === 1).map((s) => [s.storeID, s.storeName]),
    );
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
        `Error de red al contactar CheapShark: ${err instanceof Error ? err.message : String(err)}`,
        'cheapshark',
      );
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      throw new UpstreamError(
        `CheapShark respondió con status ${response.status}`,
        'cheapshark',
      );
    }

    return response.json() as Promise<T>;
  }
}
