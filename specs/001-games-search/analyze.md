# Feature 001 — Analyze

> Paso SDD: **analyze**. Trade-offs revisados antes de codear.

## A1. Fuente de verdad del OpenAPI
- **Opción A** (elegida): Zod → OpenAPI generado + YAML de diseño en `specs/`.
  - ✅ Una sola fuente de tipos + validación.
  - ✅ Diff en CI evita drift.
  - ❌ Un poco más de setup inicial (`fastify-type-provider-zod` + `zod-to-openapi`).
- Opción B: YAML manual + `openapi-typescript` para tipos.
  - ❌ Duplicidad; validación runtime requiere Ajv extra.

## A2. Estrategia de búsqueda
- **Elegida**: consultar RAWG y CheapShark en paralelo con `Promise.allSettled`.
  Merge por `slug(title)`.
- Alternativa: consultar RAWG primero y usar sus títulos canónicos para CheapShark.
  → Más lento (secuencial); descartada.

## A3. Manejo de fallo parcial
- Si una fuente falla, `meta.sources` refleja las presentes. No se rompe la respuesta.
- Si ambas fallan → 500 `UPSTREAM_ERROR`.

## A4. Cache
- Fuera de scope en FASE 1–5. Documentado en `docs/backlog.md`.
