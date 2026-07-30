# Feature 001 — Plan técnico

> Paso SDD: **plan**. Se llena en la FASE 2.

## 1. Arquitectura por capas
```
interfaces/http  →  application/use-cases  →  infrastructure/http-clients
       ↑                     ↓
       └── schemas (Zod) ──→ domain/entities
```

## 2. Componentes
- **RawgClient**, **CheapSharkClient**: adaptadores HTTP puros, retornan DTOs crudos.
- **RawgGameMapper**, **CheapSharkDealMapper**: normalización a entidades de dominio.
- **SearchGames** (use case): orquesta llamadas paralelas + merge + dedup.
- **games.controller**: valida query (Zod), delega al use case, formatea respuesta.
- **errorHandler** (middleware): mapea `DomainError` → HTTP + código estable.

## 3. Contract-First
- Los Zod schemas de `src/interfaces/http/schemas/` deben reproducir exactamente el
  `openapi/openapi.yaml`.
- `scripts/export-openapi.ts` regenera el YAML desde Zod → diff en CI contra el YAML
  de diseño en `specs/001-games-search/contracts/`.

## 4. Concurrencia y resiliencia
- `Promise.allSettled` para RAWG + CheapShark.
- Timeout por cliente: 5s.
- Reintento: 1 (backoff 200 ms) solo para errores 5xx / red.

## 5. Testing
- **unit**: mappers.
- **integration**: use case con clientes mockeados.
- **contract**: respuestas reales del endpoint validadas contra `openapi.yaml` con
  un validador (`openapi-response-validator` o similar).

## 6. Riesgos
- CheapShark no acepta búsqueda por título directa → usar `/games?title=` y luego
  `/deals?id=` para cada `gameID`. Investigar en `research.md`.
- RAWG requiere API key gratuita → variable de entorno `RAWG_API_KEY`.
