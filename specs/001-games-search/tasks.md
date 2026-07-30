# Feature 001 — Tasks

> Paso SDD: **tasks**. Lista atómica y ordenada; cada tarea debe cerrar en un solo commit.

## FASE 2 — Estructura y tipos ✅
- [x] T-201 · Configurar `package.json` + `tsconfig.json` estrictos.
- [x] T-202 · Definir Zod schemas: `Game`, `Deal`, `SearchGamesResponse`, errores.
- [x] T-203 · Script `scripts/export-openapi.ts` (Zod → `openapi/openapi.yaml`).
- [x] T-204 · Test de contrato: comparar YAML generado vs YAML de diseño.

## FASE 3 — Integraciones externas ✅
- [x] T-301 · `RawgClient.searchByTitle(title, limit)`.
- [x] T-302 · `CheapSharkClient.searchByTitle(title, limit)` + `getDealsForGame(gameId)`.
- [x] T-303 · `RawgGameMapper`, `CheapSharkDealMapper`.
- [x] T-304 · `SearchGames` use case (paralelo + merge por slug).

## FASE 4 — HTTP y errores ✅
- [x] T-401 · Ruta `GET /api/v1/games/search` con validación Zod.
- [x] T-402 · `errorHandler` centralizado (`ValidationError`, `UpstreamError`).
- [x] T-403 · Plugin `request-id` para trazabilidad en errores.

## FASE 5 — Servidor y docs ✅
- [x] T-501 · `app.ts` + `server.ts` (Fastify, plugins registrados).
- [x] T-502 · `plugins/swagger.ts` monta `/docs` con Swagger UI (generado desde Zod via jsonSchemaTransform).
- [x] T-503 · README con `npm run dev`, `npm run docs`, ejemplos `curl`.

## Analyze / Checklist / Implement
- [ ] Ejecutar `analyze.md` antes de codear T-3xx (trade-offs de mapeo/dedup).
- [ ] Marcar todos los ítems de `checklists/contract-first.md`.
- [ ] Marcar todos los ítems de `checklists/review.md` antes del PR.
