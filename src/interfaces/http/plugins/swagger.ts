import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

async function swaggerPlugin(fastify: FastifyInstance): Promise<void> {
  await fastify.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.3',
      info: {
        title: 'GameDeal Hub API',
        version: '1.0.0',
        description:
          'API REST que agrega y unifica información de videojuegos y ofertas en tiempo real ' +
          'combinando RAWG (metadatos) y CheapShark (precios).\n\n' +
          'Construida con Spec-Driven Development (Contract-First).',
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Entorno de desarrollo local' },
      ],
      tags: [
        { name: 'Games', description: 'Búsqueda y consulta unificada de videojuegos con ofertas.' },
        { name: 'System', description: 'Endpoints operativos (health, docs).' },
      ],
    },
    transform: jsonSchemaTransform,
  });

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });
}

export const swagger = fp(swaggerPlugin, {
  name: 'swagger',
});
