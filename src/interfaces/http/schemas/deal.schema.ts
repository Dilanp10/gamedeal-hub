import { z } from 'zod';
import { registry } from './registry';

export const DealSchema = registry.register(
  'Deal',
  z
    .object({
      store: z.string().min(1).max(60).openapi({
        description: 'Nombre de la tienda (Steam, Epic, GOG, etc.).',
        example: 'Steam',
      }),
      price: z.number().min(0).openapi({
        format: 'float',
        description: 'Precio actual (con descuento si aplica).',
        example: 9.99,
      }),
      original_price: z.number().min(0).nullable().optional().openapi({
        format: 'float',
        description: 'Precio original antes del descuento.',
        example: 39.99,
      }),
      currency: z.string().openapi({
        description: 'Código ISO 4217. CheapShark trabaja en USD.',
        example: 'USD',
        default: 'USD',
      }),
      discount_percentage: z.number().min(0).max(100).openapi({
        format: 'float',
        description: 'Porcentaje de descuento (0 si no hay oferta).',
        example: 75,
      }),
      deal_url: z.string().url().openapi({
        format: 'uri',
        description: 'URL de redirección de CheapShark a la tienda.',
        example: 'https://www.cheapshark.com/redirect?dealID=XYZ123',
      }),
    })
    .openapi({ description: 'Oferta activa de un videojuego en una tienda.' }),
);

export type Deal = z.infer<typeof DealSchema>;
