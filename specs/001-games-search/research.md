# Feature 001 — Research

> Notas sobre APIs externas. Se llena antes de implementar la FASE 3.

## RAWG API
- Docs: https://api.rawg.io/docs/
- Auth: `?key=RAWG_API_KEY` (gratis, registro).
- Endpoint clave: `GET https://api.rawg.io/api/games?search={title}&page_size={n}`.
- Campos usados: `id`, `slug`, `name`, `background_image`, `rating` (0–5), `released`, `genres[].name`.

## CheapShark API
- Docs: https://apidocs.cheapshark.com/
- Sin auth.
- Endpoints:
  - `GET https://www.cheapshark.com/api/1.0/games?title={t}&limit={n}` → `{ gameID, external, cheapest, thumb }`.
  - `GET https://www.cheapshark.com/api/1.0/games?id={gameID}` → detalle con `deals[]`.
  - `GET https://www.cheapshark.com/api/1.0/stores` → catálogo (storeID → nombre).
- Moneda: siempre USD.
- **User-Agent obligatorio**: CheapShark rechaza requests con User-Agent genérico (403). Enviar `GameDealHub/1.0`.
- **Campos de precios difieren por endpoint**: `/deals` usa `salePrice`/`normalPrice`; `/games?id=` usa `price`/`retailPrice`. El mapper acepta ambos.

## Mapeo → esquema unificado
| Campo unificado | Fuente | Notas |
|---|---|---|
| `id` | derivado | `slugify(title)` estable. |
| `title` | RAWG.name || CheapShark.external | Preferir RAWG si ambos. |
| `cover_image` | RAWG.background_image \|\| CheapShark.thumb | RAWG suele tener mejor resolución. |
| `rating` | RAWG.rating | 0–5. |
| `release_date` | RAWG.released | ISO `YYYY-MM-DD`. |
| `genres` | RAWG.genres[].name | Vacío si no hay RAWG. |
| `deals[]` | CheapShark | Ordenados por `salePrice`. |
| `deals[].store` | Lookup `storeID` → nombre | Cachear catálogo en memoria. |
| `deals[].price` | `salePrice` | number. |
| `deals[].original_price` | `normalPrice` | null si igual a `salePrice`. |
| `deals[].discount_percentage` | `savings` | round(2). |
| `deals[].deal_url` | `https://www.cheapshark.com/redirect?dealID=...` | |
