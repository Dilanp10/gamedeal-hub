# Feature 001 — Clarify

> Paso SDD: **clarify**. Preguntas surgidas del `spec.md` con su respuesta acordada.

| # | Pregunta | Decisión | Motivo |
|---|----------|----------|--------|
| C1 | ¿Framework + validación? | Fastify + Zod (`fastify-type-provider-zod`) | Contract-First con una sola fuente (Zod → OpenAPI + tipos TS). |
| C2 | ¿Fuente de verdad del contrato? | `openapi/openapi.yaml` (generado desde Zod), con copia de diseño en `specs/001-games-search/contracts/`. | El YAML de `specs/` congela la intención de diseño; el de `openapi/` es lo que se sirve. |
| C3 | ¿Forma del `id` unificado? | `slug` string estable derivado del título canónico. | Desacopla de los IDs numéricos de RAWG y string de CheapShark. |
| C4 | ¿Moneda? | Fija en `USD`. | CheapShark solo entrega USD. |
| C5 | ¿Qué hacer si CheapShark responde pero RAWG no (o viceversa)? | Devolver `data` con los campos disponibles y marcar en `meta.sources` solo las fuentes usadas. | Degradación grácil, mejor que 500. |
| C6 | ¿Deduplicación entre fuentes? | Por slug normalizado del título. | Suficiente para el scope actual. |

## Preguntas pendientes
_(Añadir aquí cuando surjan durante `plan` / `tasks`.)_
