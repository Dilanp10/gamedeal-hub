import { z } from 'zod';
import { registry } from './registry';
import { DealSchema } from './deal.schema';

export const GameSchema = registry.register(
  'Game',
  z
    .object({
      id: z.string().openapi({
        description: 'ID interno unificado de GameDeal Hub (slug estable).',
        example: 'the-witcher-3-wild-hunt',
      }),
      title: z.string().openapi({ example: 'The Witcher 3 Wild Hunt' }),
      cover_image: z.string().url().nullable().optional().openapi({
        format: 'uri',
        example: 'https://media.rawg.io/media/games/618/618c2031a07bbff6b4f611f10b6bcdbc.jpg',
      }),
      rating: z.number().min(0).max(5).nullable().optional().openapi({
        format: 'float',
        description: 'Calificación normalizada 0-5 (fuente RAWG).',
        example: 4.66,
      }),
      release_date: z.string().nullable().optional().openapi({
        format: 'date',
        example: '2015-05-18',
      }),
      genres: z.array(z.string()).openapi({ example: ['RPG', 'Adventure'] }),
      deals: z.array(DealSchema).openapi({
        description: 'Ofertas activas ordenadas por mejor precio.',
      }),
    })
    .openapi({ description: 'Videojuego con metadatos unificados y ofertas activas.' }),
);

export type Game = z.infer<typeof GameSchema>;
