import { registry } from './registry';
import { SearchGamesResponseSchema, SearchQuerySchema } from './search.schema';
import { ValidationErrorResponseSchema } from './error.schema';
import { ErrorResponseSchema } from './error.schema';

registry.registerPath({
  method: 'get',
  path: '/api/v1/games/search',
  tags: ['Games'],
  operationId: 'searchGames',
  summary: 'Busca videojuegos por título y devuelve metadatos + ofertas unificadas.',
  description:
    'Consulta RAWG (metadatos) y CheapShark (ofertas) en paralelo, normaliza ambas ' +
    'respuestas al esquema Game y devuelve una lista deduplicada. ' +
    'Si un juego no tiene ofertas activas, deals será un arreglo vacío.',
  request: {
    query: SearchQuerySchema,
  },
  responses: {
    200: {
      description: 'Lista de juegos encontrados (puede estar vacía).',
      content: {
        'application/json': { schema: SearchGamesResponseSchema },
      },
    },
    400: {
      description: 'Parámetros de entrada inválidos.',
      content: {
        'application/json': { schema: ValidationErrorResponseSchema },
      },
    },
    500: {
      description: 'Error interno o falla al consultar una fuente externa.',
      content: {
        'application/json': { schema: ErrorResponseSchema },
      },
    },
  },
});
