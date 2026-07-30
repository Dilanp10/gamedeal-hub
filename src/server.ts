import { env } from './infrastructure/config/env';
import { buildApp } from './app';
import { SearchGames } from './application/use-cases/SearchGames';
import { RawgClient } from './infrastructure/http-clients/RawgClient';
import { CheapSharkClient } from './infrastructure/http-clients/CheapSharkClient';

async function main(): Promise<void> {
  const rawgClient = new RawgClient(env.RAWG_BASE_URL, env.RAWG_API_KEY, env.UPSTREAM_TIMEOUT_MS);
  const cheapSharkClient = new CheapSharkClient(env.CHEAPSHARK_BASE_URL, env.UPSTREAM_TIMEOUT_MS);
  const searchGames = new SearchGames(rawgClient, cheapSharkClient);

  const app = await buildApp({
    searchGames,
    logger: true,
    enableSwagger: true,
  });

  await app.listen({ port: env.PORT, host: '0.0.0.0' });

  console.log(`
  ╔═══════════════════════════════════════════════╗
  ║  GameDeal Hub API running                     ║
  ║  API:  http://localhost:${env.PORT}/api/v1       ║
  ║  Docs: http://localhost:${env.PORT}/docs          ║
  ╚═══════════════════════════════════════════════╝
  `);
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
