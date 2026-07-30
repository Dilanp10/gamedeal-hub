# Requisitos

## Funcionales
- **RF-1**: Buscar juegos por título parcial (mínimo 2 caracteres).
- **RF-2**: Devolver metadatos unificados (RAWG) + ofertas activas (CheapShark).
- **RF-3**: Limitar la cantidad de resultados (`limit`, default 10, máx. 50).
- **RF-4**: Servir Swagger UI en `/docs` con el contrato OpenAPI vigente.
- **RF-5**: Devolver errores tipados con `code` estable.

## No funcionales
- **RNF-1** — Rendimiento: p95 < 1500 ms con red normal (dominado por upstreams).
- **RNF-2** — Resiliencia: fallo de UNA fuente no rompe la respuesta; fallo de ambas → 500.
- **RNF-3** — Observabilidad: `request_id` en logs y en errores 5xx.
- **RNF-4** — Portabilidad: Node LTS actual; sin dependencias nativas.
- **RNF-5** — Seguridad: sin secretos en repo; API keys por env; CORS configurable.
- **RNF-6** — Documentación: OpenAPI siempre sincronizado con el código (CI enforced).
