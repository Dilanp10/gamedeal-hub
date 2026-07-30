import { z } from 'zod';
import { registry } from './registry';
import { GameSchema } from './game.schema';

export const SearchMetaSchema = registry.register(
  'SearchMeta',
  z.object({
    query: z.string().openapi({ example: 'The Witcher 3' }),
    count: z.number().int().min(0).openapi({ example: 3 }),
    sources: z.array(z.enum(['rawg', 'cheapshark'])).openapi({
      example: ['rawg', 'cheapshark'],
    }),
  }),
);

export const SearchGamesResponseSchema = registry.register(
  'SearchGamesResponse',
  z.object({
    data: z.array(GameSchema),
    meta: SearchMetaSchema,
  }),
);

export const SearchQuerySchema = z.object({
  title: z.string().min(2).max(100).openapi({
    description: 'Título (o parte del título) del videojuego a buscar. Mínimo 2 caracteres.',
    example: 'The Witcher 3',
  }),
  limit: z.coerce.number().int().min(1).max(50).default(10).openapi({
    description: 'Cantidad máxima de juegos a devolver.',
  }),
});

export type SearchMeta = z.infer<typeof SearchMetaSchema>;
export type SearchGamesResponse = z.infer<typeof SearchGamesResponseSchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
