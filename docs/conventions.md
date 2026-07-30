# Convenciones del proyecto

> Para convenciones de código específicas, ver `AGENTS.md`.

## Ramas
- `main`: siempre desplegable.
- `feat/NNN-nombre`: una rama por feature (mismo `NNN` que en `specs/`).
- `fix/…`, `chore/…`, `docs/…`, `refactor/…`.

## Commits
- Conventional Commits (`feat`, `fix`, `docs`, `chore`, `refactor`, `test`).
- Alcance opcional entre paréntesis: `feat(games): ...`.
- Mensaje en imperativo, en inglés, < 72 chars la primera línea.

## Pull Requests
- Título = commit principal.
- Descripción enlaza a la feature (`specs/NNN-*`).
- Checklist de `specs/NNN-*/checklists/review.md` marcado.
- CI debe estar verde: `lint`, `test`, `openapi:diff`.

## Estilo HTTP
- URLs en `kebab-case` (`/api/v1/games/search`).
- Campos JSON en `snake_case` (para consumidores externos).
- Campos de dominio en `camelCase` (interno TS).
- Los mappers convierten entre ambos mundos.

## Versionado de la API
- Prefijo `/api/v1/…`.
- Cambios breaking → `v2` nuevo, no se rompe `v1` sin ventana de deprecación.

## Errores
- Formato único (ver `openapi.yaml`): `{ error: { code, message, details?, request_id? } }`.
- `code` proviene de un enum documentado en el contrato.
