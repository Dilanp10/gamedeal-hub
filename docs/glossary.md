# Glosario ES ↔ EN

Términos oficiales del proyecto. La columna EN es la que se usa en código.

| Español | English (código) | Notas |
|---|---|---|
| Juego / Videojuego | `Game` | Entidad de dominio. |
| Oferta | `Deal` | Precio activo en una tienda. |
| Tienda | `Store` | Steam, Epic, GOG, etc. |
| Portada | `coverImage` / `cover_image` | Snake case en el contrato, camel en dominio. |
| Calificación | `rating` | 0–5. |
| Fecha de lanzamiento | `releaseDate` / `release_date` | ISO `YYYY-MM-DD`. |
| Género | `genre` | |
| Precio actual | `price` | Con descuento aplicado. |
| Precio original | `originalPrice` / `original_price` | Antes del descuento. |
| Porcentaje de descuento | `discountPercentage` / `discount_percentage` | 0–100. |
| Enlace de la oferta | `dealUrl` / `deal_url` | Redirect de CheapShark. |
| Contrato | `contract` | `openapi.yaml`. |
| Especificación | `spec` | `specs/NNN-*/spec.md`. |
| Caso de uso | `use case` | Capa `application`. |
| Adaptador | `adapter` | Capa `infrastructure`. |
| Borde / Puerto | `edge` / `port` | Capa `interfaces`. |
| Origen externo | `upstream` | RAWG, CheapShark. |
| Aguas abajo | `downstream` | Clientes de nuestra API. |
| ID de petición | `requestId` / `request_id` | Traza en logs y errores. |
