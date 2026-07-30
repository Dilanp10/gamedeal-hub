# AGENTS.md — Convenciones de código

Guía obligatoria para cualquier agente (humano o IA) que escriba código en este repo.

## Idioma
- **Código, identificadores, commits, PRs, comentarios técnicos**: inglés.
- **Docs, specs, ADRs, glosario**: español.

## TypeScript
- `strict: true`, `noUncheckedIndexedAccess: true`.
- Prohibido `any` sin comentario `// TODO(any): motivo`.
- Prohibido `!` (non-null assertion) salvo justificación en línea.
- Preferir `type` para uniones/aliases y `interface` para contratos extensibles.

## Naming
- Archivos: `kebab-case.ts`. Clases y tipos: `PascalCase`. Funciones/vars: `camelCase`.
- Constantes de módulo: `SCREAMING_SNAKE_CASE`.
- Tests: `<archivo>.test.ts` junto al archivo o en `tests/` según el tipo.

## Estructura de módulos
- Un export nombrado por archivo (evitar `export default`).
- Barrels (`index.ts`) solo en `domain/entities/`.

## Fastify + Zod
- Schemas Zod viven en `src/interfaces/http/schemas/`.
- Rutas registran `schema: { querystring, response }` desde Zod, sin duplicar validación.
- Controllers son delgados: parsean → llaman use case → devuelven DTO.

## Clean Architecture
| Capa | Puede importar de |
|---|---|
| `domain` | nada del proyecto |
| `application` | `domain` |
| `infrastructure` | `domain`, `application`, libs externas |
| `interfaces` | todas las anteriores |

## Errores
- Extender `DomainError` para errores de negocio.
- `errorHandler` centralizado los mapea a HTTP + `code` de enum del contrato.
- Nunca lanzar strings ni objetos anónimos.

## Commits (Conventional Commits)
- `feat(games): add search endpoint`
- `fix(mapper): handle missing rating`
- `docs(spec): clarify dedup rule`
- `chore(openapi): regenerate from zod`
- `test(contract): validate search response`

## PRs
- Descripción menciona la feature (`specs/NNN-*`).
- Checklist de `specs/NNN-*/checklists/` marcado.
- CI verde (lint + test + `openapi:diff`).

## Testing
- **unit**: puros, sin red ni FS.
- **integration**: use cases con dobles de clientes HTTP.
- **contract**: valida respuestas del servidor real contra `openapi/openapi.yaml`.
