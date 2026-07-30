# Feature 001 — Games Search (spec)

> Paso SDD: **specify**. Aquí va el QUÉ y el POR QUÉ, no el CÓMO técnico.

## 1. Resumen
Endpoint público `GET /api/v1/games/search?title={nombre}&limit={n}` que devuelve una
lista unificada de videojuegos con sus metadatos (RAWG) y ofertas activas (CheapShark)
en una sola estructura estable definida por el contrato OpenAPI.

## 2. Problema / Motivación
- Los usuarios que quieren comparar precios y datos de un juego deben visitar múltiples
  sitios (tiendas + RAWG + agregadores).
- Los desarrolladores frontend no tienen un contrato uniforme: RAWG y CheapShark
  entregan JSONs distintos, con IDs y campos incompatibles.

## 3. Objetivos
- **O1**: Exponer un único endpoint que consolide metadatos + ofertas.
- **O2**: Garantizar respuestas estables y tipadas mediante Contract-First (OpenAPI + Zod).
- **O3**: Documentar el contrato en `/docs` (Swagger UI) generado desde el mismo esquema.

## 4. Fuera de alcance (esta feature)
- Autenticación / rate limiting por usuario.
- Persistencia (cache real con Redis, base de datos).
- Búsqueda avanzada (filtros por género, plataforma, tienda).
- Paginación por cursor.

## 5. Historias de usuario
- **HU-1** — Como consumidor de la API, quiero buscar por título parcial y recibir una
  lista uniforme para mostrar en mi UI sin transformar dos formatos distintos.
- **HU-2** — Como desarrollador, quiero recibir errores tipados (`VALIDATION_ERROR`,
  `UPSTREAM_ERROR`) para manejarlos programáticamente.

## 6. Criterios de aceptación
- **CA-1**: `GET /api/v1/games/search?title=witcher` responde 200 con `data[]` y `meta`.
- **CA-2**: Falta `title` o `title` < 2 caracteres → 400 con `code=VALIDATION_ERROR`.
- **CA-3**: RAWG o CheapShark caídos → 500 con `code=UPSTREAM_ERROR` y `request_id`.
- **CA-4**: Un juego sin ofertas devuelve `deals: []`, nunca `null` ni omite el campo.
- **CA-5**: La respuesta valida contra `openapi/openapi.yaml` (test de contrato).
- **CA-6**: `/docs` sirve Swagger UI con el mismo contrato.

## 7. Preguntas abiertas
Ver [`clarify.md`](./clarify.md).
