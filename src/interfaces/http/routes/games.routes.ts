import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { SearchQuerySchema, SearchGamesResponseSchema } from '../schemas/search.schema';
import { ValidationErrorResponseSchema, ErrorResponseSchema } from '../schemas/error.schema';
import { makeGamesController } from '../controllers/games.controller';
import type { SearchGames } from '../../../application/use-cases/SearchGames';

export function registerGamesRoutes(fastify: FastifyInstance, searchGames: SearchGames): void {
  const app = fastify.withTypeProvider<ZodTypeProvider>();
  const controller = makeGamesController(searchGames);

  app.get(
    '/api/v1/games/search',
    {
      schema: {
        tags: ['Games'],
        summary: 'Busca videojuegos por título y devuelve metadatos + ofertas unificadas.',
        querystring: SearchQuerySchema,
        response: {
          200: SearchGamesResponseSchema,
          400: ValidationErrorResponseSchema,
          500: ErrorResponseSchema,
        },
      },
    },
    controller.search,
  );
}
