import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { SearchGames } from '../../src/application/use-cases/SearchGames';
import { UpstreamError } from '../../src/domain/errors/UpstreamError';
import type { IRawgClient, ICheapSharkClient } from '../../src/application/use-cases/SearchGames';

const rawgGame = {
  id: 'the-witcher-3-wild-hunt',
  title: 'The Witcher 3 Wild Hunt',
  coverImage: 'https://media.rawg.io/img.jpg',
  rating: 4.66,
  releaseDate: '2015-05-18',
  genres: ['RPG', 'Adventure'],
};

const deals = [
  {
    store: 'Steam',
    price: 9.99,
    originalPrice: 39.99,
    currency: 'USD',
    discountPercentage: 75,
    dealUrl: 'https://www.cheapshark.com/redirect?dealID=ABC',
  },
];

function makeRawg(override?: Partial<IRawgClient>): IRawgClient {
  return { searchByTitle: vi.fn().mockResolvedValue([rawgGame]), ...override };
}

function makeCheapShark(override?: Partial<ICheapSharkClient>): ICheapSharkClient {
  return {
    searchByTitle: vi.fn().mockResolvedValue([
      { gameId: '123', title: 'The Witcher 3 Wild Hunt', thumb: 'https://thumb.jpg' },
    ]),
    getDealsForGame: vi.fn().mockResolvedValue(deals),
    ...override,
  };
}

describe('GET /api/v1/games/search', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    const useCase = new SearchGames(makeRawg(), makeCheapShark());
    app = await buildApp({ searchGames: useCase });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('200: devuelve data + meta con formato snake_case', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/games/search?title=witcher',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].cover_image).toBe('https://media.rawg.io/img.jpg');
    expect(body.data[0].deals[0].deal_url).toContain('cheapshark');
    expect(body.data[0].deals[0].discount_percentage).toBe(75);
    expect(body.meta.query).toBe('witcher');
    expect(body.meta.sources).toContain('rawg');
  });

  it('200: respeta el parámetro limit', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/games/search?title=witcher&limit=1',
    });

    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.data.length).toBeLessThanOrEqual(1);
  });

  it('400: responde VALIDATION_ERROR cuando falta title', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/games/search',
    });

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.payload);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('400: responde VALIDATION_ERROR cuando title tiene 1 carácter', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/games/search?title=a',
    });

    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.payload);
    expect(body.error.code).toBe('VALIDATION_ERROR');
  });

  it('agrega header x-request-id en la respuesta', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/games/search?title=witcher',
    });

    expect(res.headers['x-request-id']).toBeDefined();
    expect(typeof res.headers['x-request-id']).toBe('string');
  });

  it('preserva x-request-id si el cliente lo envía', async () => {
    const customId = 'my-trace-id-12345';
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/games/search?title=witcher',
      headers: { 'x-request-id': customId },
    });

    expect(res.headers['x-request-id']).toBe(customId);
  });
});

describe('GET /api/v1/games/search — error handling', () => {
  it('500: devuelve UPSTREAM_ERROR con request_id cuando ambas fuentes fallan', async () => {
    const rawg = makeRawg({
      searchByTitle: vi.fn().mockRejectedValue(new Error('down')),
    });
    const cs = makeCheapShark({
      searchByTitle: vi.fn().mockRejectedValue(new Error('down')),
    });
    const useCase = new SearchGames(rawg, cs);
    const app = await buildApp({ searchGames: useCase });
    await app.ready();

    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/games/search?title=witcher',
    });

    expect(res.statusCode).toBe(500);
    const body = JSON.parse(res.payload);
    expect(body.error.code).toBe('UPSTREAM_ERROR');
    expect(body.error.request_id).toBeDefined();

    await app.close();
  });
});
