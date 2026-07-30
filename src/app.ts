import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { requestIdMiddleware } from './interfaces/http/middlewares/requestId';
import { errorHandler } from './interfaces/http/middlewares/errorHandler';
import { swagger } from './interfaces/http/plugins/swagger';
import { registerGamesRoutes } from './interfaces/http/routes/games.routes';
import type { SearchGames } from './application/use-cases/SearchGames';

export interface BuildAppDeps {
  searchGames: SearchGames;
  logger?: boolean;
  enableSwagger?: boolean;
}

export async function buildApp(deps: BuildAppDeps) {
  const app = Fastify({ logger: deps.logger ?? false });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler(errorHandler);

  await app.register(requestIdMiddleware);

  if (deps.enableSwagger !== false) {
    await app.register(swagger);
  }

  registerGamesRoutes(app, deps.searchGames);

  return app;
}
