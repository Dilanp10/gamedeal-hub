# Feature 001 — Data model

> Entidades de dominio (independientes de HTTP, RAWG y CheapShark).

## Game
| Campo | Tipo | Nullable | Reglas |
|---|---|---|---|
| id | string (slug) | no | `^[a-z0-9-]+$`, único por título canónico. |
| title | string | no | 1–200 chars. |
| coverImage | URL | sí | http(s). |
| rating | number | sí | 0 ≤ x ≤ 5. |
| releaseDate | Date (ISO date) | sí | |
| genres | string[] | no (default `[]`) | Sin duplicados. |
| deals | Deal[] | no (default `[]`) | Ordenados por `price` asc. |

## Deal
| Campo | Tipo | Nullable | Reglas |
|---|---|---|---|
| store | string | no | 1–60 chars. |
| price | number | no | ≥ 0. |
| originalPrice | number | sí | ≥ price cuando presente. |
| currency | string | no | ISO 4217, fijo `USD` en v1. |
| discountPercentage | number | no | 0 ≤ x ≤ 100. |
| dealUrl | URL | no | https. |

## Invariantes
- `price ≤ originalPrice` cuando `originalPrice != null`.
- Si `discountPercentage == 0` entonces `originalPrice == null` o `originalPrice == price`.
- `deals[].store` no vacío.
