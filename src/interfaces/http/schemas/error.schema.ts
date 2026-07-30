import { z } from 'zod';
import { registry } from './registry';

export const ValidationErrorResponseSchema = registry.register(
  'ValidationErrorResponse',
  z.object({
    error: z.object({
      code: z.literal('VALIDATION_ERROR').openapi({ example: 'VALIDATION_ERROR' }),
      message: z.string().openapi({ example: 'Parámetros de entrada inválidos.' }),
      details: z.array(
        z.object({
          field: z.string().openapi({ example: 'title' }),
          issue: z.string().openapi({
            example:
              'El parámetro "title" es obligatorio y debe tener al menos 2 caracteres.',
          }),
        }),
      ),
    }),
  }),
);

export const ErrorResponseSchema = registry.register(
  'ErrorResponse',
  z.object({
    error: z.object({
      code: z.enum(['INTERNAL_ERROR', 'UPSTREAM_ERROR', 'NOT_FOUND']).openapi({
        example: 'UPSTREAM_ERROR',
      }),
      message: z.string().openapi({
        example: 'No se pudo obtener información de la fuente externa (RAWG).',
      }),
      request_id: z.string().uuid().nullable().optional().openapi({
        example: '3f9c2b6e-1a4a-4a2e-9c1f-2b0e5f7a1d10',
      }),
    }),
  }),
);

export type ValidationErrorResponse = z.infer<typeof ValidationErrorResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
