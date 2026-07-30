# GameDeal Hub — Contexto para Claude

## Qué es este proyecto
API REST backend de portafolio que **agrega y unifica** datos de dos APIs públicas:
- **RAWG API** → metadatos de videojuegos (título, portada, rating, géneros, fecha).
- **CheapShark API** → precios actuales, descuentos y tiendas (Steam, Epic, GOG…).

Endpoint principal: `GET /api/v1/games/search?title={t}&limit={n}` con documentación
Swagger UI en `/docs`.

## Metodología
- **Spec-Driven Development (SDD) / Contract-First**.
- Cada feature vive en `specs/NNN-nombre/` y pasa por:
  `specify → clarify → plan → tasks → analyze → checklist → implement`.
- Principios inamovibles en `.specify/memory/constitution.md`.

## Stack
- Node.js + TypeScript (strict).
- Fastify + `fastify-type-provider-zod` (Zod es la fuente de tipos y validación).
- Swagger UI generado desde el mismo Zod/OpenAPI.
- Axios (o fetch nativo) para clientes HTTP externos.

## Estructura clave
- `openapi/openapi.yaml` — contrato público (fuente de verdad, generado desde Zod).
- `specs/001-games-search/contracts/games-search.openapi.yaml` — contrato de diseño.
- `src/domain/` — entidades puras (Game, Deal).
- `src/application/use-cases/` — orquestación (SearchGames).
- `src/infrastructure/` — clientes HTTP + mappers.
- `src/interfaces/http/` — Fastify (routes, controllers, schemas Zod, middlewares).
- `docs/` — documentación humana en español (requirements, ADRs, glosario…).

## Reglas al trabajar aquí
1. **Nunca** implementes lógica antes de actualizar el OpenAPI y el spec de la feature.
2. Zod schemas viven en `src/interfaces/http/schemas/`; el resto de capas usa entidades
   de `src/domain/`.
3. Convenciones de código en `AGENTS.md`. Convenciones de proyecto en `docs/conventions.md`.
4. Documentación en español, identificadores/commits/PRs en inglés.
5. Si algo no está claro, PREGUNTA. No asumas por tu cuenta.

## Comandos (una vez configurado el `package.json`)
```bash
npm run dev              # Fastify en modo watch
npm run build            # tsc
npm run test             # unit + integration + contract
npm run openapi:export   # regenera openapi/openapi.yaml desde Zod
npm run openapi:diff     # falla si openapi/openapi.yaml difiere del contrato de diseño
```
