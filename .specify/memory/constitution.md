# GameDeal Hub — Constitution

Principios **no negociables** del proyecto. Cualquier PR que los viole debe justificar
por escrito la excepción en `docs/decisions.md` (ADR).

## 1. Contract-First es la ley
El archivo `openapi/openapi.yaml` (y su gemelo de diseño en `specs/<feature>/contracts/`)
se modifica **antes** que cualquier línea de código de aplicación. Si un endpoint
responde algo que no está declarado en el contrato, es un bug.

## 2. Spec-Driven Development (SDD) por feature
Cada feature nueva vive en `specs/NNN-nombre/` y sigue el workflow:
`specify → clarify → plan → tasks → analyze → checklist → implement`.
Ningún paso se salta. Cada uno deja un archivo trazable.

## 3. Separación de capas (Clean Architecture)
- `domain/` no importa de `infrastructure/` ni de `interfaces/`.
- `application/` orquesta; no habla HTTP ni SQL directamente.
- `infrastructure/` toca el mundo exterior (HTTP, DB, filesystem).
- `interfaces/` es el borde (Fastify, CLI, workers).

## 4. Fallar rápido y con tipo
- Validación en el borde con Zod. Los use cases confían en sus tipos.
- Errores tipados en respuestas (`code` de enum estable). Nunca stack traces al cliente.

## 5. Nada de secretos en el repo
- Variables sensibles siempre en `.env` (gitignored). `.env.example` documenta el shape.
- `env.ts` valida el entorno con Zod al arrancar; falla si falta algo.

## 6. Sin `any` gratuito
- TypeScript en `strict: true`. `any` requiere comentario justificando.
- Los DTOs externos (RAWG, CheapShark) se tipan y se transforman inmediatamente.

## 7. Documentación en español, código en inglés
- Archivos de `docs/` y `specs/` en español.
- Identificadores, commits, PRs y comentarios técnicos en inglés.
- Glosario oficial en `docs/glossary.md`.

## 8. Tests obligatorios
- Cada mapper: unit test.
- Cada endpoint: contract test contra el OpenAPI.
- Cada use case: integration test con clientes mockeados.
