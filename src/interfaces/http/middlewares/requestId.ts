import { randomUUID } from 'crypto';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function requestIdPlugin(fastify: FastifyInstance): Promise<void> {
  fastify.addHook('onRequest', async (request, reply) => {
    const id = (request.headers['x-request-id'] as string | undefined) ?? randomUUID();
    request.headers['x-request-id'] = id;
    reply.header('x-request-id', id);
  });
}

export const requestIdMiddleware = fp(requestIdPlugin, {
  name: 'request-id',
});
