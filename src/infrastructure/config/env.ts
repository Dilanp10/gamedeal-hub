import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  RAWG_API_KEY: z.string().min(1, 'RAWG_API_KEY es obligatoria. Obtenerla en https://rawg.io/apidocs'),
  RAWG_BASE_URL: z.string().url().default('https://api.rawg.io/api'),
  CHEAPSHARK_BASE_URL: z.string().url().default('https://www.cheapshark.com/api/1.0'),
  UPSTREAM_TIMEOUT_MS: z.coerce.number().int().min(500).default(5000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('❌  Variables de entorno inválidas o faltantes:');
  console.error(JSON.stringify(result.error.format(), null, 2));
  process.exit(1);
}

export const env = result.data;
export type Env = typeof env;
