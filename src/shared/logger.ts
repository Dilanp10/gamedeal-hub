// Placeholder reemplazado por Pino (Fastify) en FASE 5.
export const logger = {
  info: (msg: string, ...args: unknown[]) => console.log(`[INFO]  ${msg}`, ...args),
  warn: (msg: string, ...args: unknown[]) => console.warn(`[WARN]  ${msg}`, ...args),
  error: (msg: string, ...args: unknown[]) => console.error(`[ERROR] ${msg}`, ...args),
  debug: (msg: string, ...args: unknown[]) => console.log(`[DEBUG] ${msg}`, ...args),
};
