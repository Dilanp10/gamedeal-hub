# Backlog (fuera de scope actual)

Ideas registradas para no perderlas. Ninguna entra al scope hasta convertirse en su
propia feature dentro de `specs/`.

- **Cache**: TTL 5–15 min por título (in-memory primero, Redis si escala).
- **Rate limiting**: por IP + por API key opcional.
- **Filtros**: `genre`, `platform`, `store`, `min_discount`, `max_price`.
- **Paginación**: `page` + `page_size` o cursor.
- **i18n**: multi-currency (requiere fuente alternativa; CheapShark solo USD).
- **Notificaciones**: webhook cuando un juego baja de X precio.
- **Persistencia**: histórico de precios para gráficas.
- **Auth**: cuentas y favoritos.
- **Colisión de slugs**: estrategia de desambiguación (`slug-<year>`).
- **CI**: workflow con lint + test + `openapi:diff` + build.
