# Roadmap

## FASE 1 · Especificación OpenAPI ✅
- Contrato `openapi.yaml` diseñado.
- Estructura del proyecto creada.
- Documentos SDD del feature 001 en su esqueleto.

## FASE 2 · Estructura + tipos ✅
- `package.json`, `tsconfig.json`, Vitest, Prettier.
- Zod schemas espejo del contrato.
- Script `openapi:export` + test de contrato (diff YAML).

## FASE 3 · Integraciones externas ✅
- `RawgClient`, `CheapSharkClient` con timeouts (AbortController).
- Mappers a entidades de dominio.
- Use case `SearchGames` (paralelo + merge por slug).

## FASE 4 · HTTP y errores ✅
- Ruta `/api/v1/games/search` con validación Zod.
- `errorHandler` centralizado con `code` estable.
- Plugin `request-id`.

## FASE 5 · Servidor + docs ✅
- `app.ts` + `server.ts` (Fastify + dotenv).
- `/docs` (Swagger UI) via `jsonSchemaTransform`.
- README con curl de ejemplo.

## Post-portafolio (ver `backlog.md`)
- Cache (Redis / in-memory con TTL).
- Rate limiting.
- Filtros (género, plataforma, tienda).
- Autenticación y favoritos.
