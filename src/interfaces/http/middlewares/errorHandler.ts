import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { DomainError } from '../../../domain/errors/DomainError';
import { UpstreamError } from '../../../domain/errors/UpstreamError';

export function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  const requestId = (request.headers['x-request-id'] as string | undefined) ?? null;

  // Zod validation errors (thrown by fastify-type-provider-zod)
  if (error instanceof ZodError) {
    const details = error.issues.map((issue) => ({
      field: issue.path.join('.'),
      issue: issue.message,
    }));
    reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Parámetros de entrada inválidos.',
        details,
      },
    });
    return;
  }

  // Fastify native validation errors (statusCode 400)
  if ('statusCode' in error && error.statusCode === 400) {
    reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message,
        details: [],
      },
    });
    return;
  }

  // Domain: upstream failure
  if (error instanceof UpstreamError) {
    request.log.error({ err: error, source: error.source }, 'Upstream error');
    reply.status(500).send({
      error: {
        code: 'UPSTREAM_ERROR',
        message: error.message,
        request_id: requestId,
      },
    });
    return;
  }

  // Domain: generic business error
  if (error instanceof DomainError) {
    request.log.error({ err: error }, 'Domain error');
    reply.status(500).send({
      error: {
        code: error.code,
        message: error.message,
        request_id: requestId,
      },
    });
    return;
  }

  // Unhandled
  request.log.error({ err: error }, 'Unhandled error');
  reply.status(500).send({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Error interno del servidor.',
      request_id: requestId,
    },
  });
}
