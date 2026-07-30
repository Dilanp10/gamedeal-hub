import type { FastifyReply, FastifyRequest } from 'fastify';
import type { SearchGames } from '../../../application/use-cases/SearchGames';
import type { SearchQuery } from '../schemas/search.schema';
import type { Game as DomainGame } from '../../../domain/entities/Game';

function toDealResponse(deal: DomainGame['deals'][number]) {
  return {
    store: deal.store,
    price: deal.price,
    original_price: deal.originalPrice,
    currency: deal.currency,
    discount_percentage: deal.discountPercentage,
    deal_url: deal.dealUrl,
  };
}

function toGameResponse(game: DomainGame) {
  return {
    id: game.id,
    title: game.title,
    cover_image: game.coverImage,
    rating: game.rating,
    release_date: game.releaseDate,
    genres: game.genres,
    deals: game.deals.map(toDealResponse),
  };
}

export function makeGamesController(searchGames: SearchGames) {
  return {
    async search(
      request: FastifyRequest<{ Querystring: SearchQuery }>,
      reply: FastifyReply,
    ): Promise<void> {
      const { title, limit } = request.query;

      const result = await searchGames.execute({ title, limit });

      reply.send({
        data: result.games.map(toGameResponse),
        meta: {
          query: title,
          count: result.games.length,
          sources: result.sources,
        },
      });
    },
  };
}
