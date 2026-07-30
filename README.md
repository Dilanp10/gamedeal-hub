# GameDeal Hub API

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Dilanp10/gamedeal-hub)

Agregador y comparador de videojuegos y ofertas en tiempo real.
Combina **RAWG** (metadatos) y **CheapShark** (precios) en una sola API REST tipada.

Proyecto de portafolio construido con **Spec-Driven Development (Contract-First)**:
OpenAPI primero, código después.

> 🔗 **Demo en vivo**: _pendiente de deploy — ver sección [Deploy](#deploy)_

## Stack
- Node.js + TypeScript (strict)
- Fastify + `fastify-type-provider-zod`
- Swagger UI en `/docs`

## Inicio rápido

```bash
cp .env.example .env
# Completar RAWG_API_KEY en .env

npm install
npm run dev
```

Abre `http://localhost:3000/docs` para explorar la API interactivamente.

## Endpoint principal

```
GET /api/v1/games/search?title=witcher&limit=5
```

Respuesta (200):

```json
{
  "data": [
    {
      "id": "the-witcher-3-wild-hunt",
      "title": "The Witcher 3 Wild Hunt",
      "cover_image": "https://...",
      "rating": 4.66,
      "release_date": "2015-05-18",
      "genres": ["RPG", "Adventure"],
      "deals": [
        {
          "store": "GOG",
          "price": 9.99,
          "original_price": 39.99,
          "currency": "USD",
          "discount_percentage": 75,
          "deal_url": "https://www.cheapshark.com/redirect?dealID=..."
        }
      ]
    }
  ],
  "meta": {
    "query": "witcher",
    "count": 1,
    "sources": ["rawg", "cheapshark"]
  }
}
```

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor en modo watch |
| `npm run build` | Compilar TypeScript |
| `npm run test` | Todos los tests (unit + integration + contract) |
| `npm run openapi:export` | Regenerar `openapi/openapi.yaml` desde Zod |
| `npm run openapi:diff` | Fallar si el YAML generado difiere del de diseño |

## Deploy

Configurado para [Render](https://render.com) vía `render.yaml` (Blueprint):

1. Crea cuenta en Render y conectá tu GitHub.
2. **New +** → **Blueprint** → seleccioná el repo `gamedeal-hub`.
3. Render lee `render.yaml` y configura build (`npm ci && npm run build`) y start
   (`npm start`) automáticamente.
4. En el dashboard, completá la env var `RAWG_API_KEY` (marcada `sync: false`,
   nunca se commitea).
5. Deploy. La app queda en `https://gamedeal-hub-XXXX.onrender.com`.

> El plan free de Render duerme tras 15 min de inactividad; la primera request
> tras el sleep tarda ~30s en responder.

## Estructura
Ver [`CLAUDE.md`](./CLAUDE.md) para el contexto completo y [`docs/`](./docs/) para
la documentación en español.

## Metodología SDD
Cada feature en `specs/NNN-nombre/`. Workflow:
`specify → clarify → plan → tasks → analyze → checklist → implement`.

Ver [specs/001-games-search/](./specs/001-games-search/) para el feature actual.
