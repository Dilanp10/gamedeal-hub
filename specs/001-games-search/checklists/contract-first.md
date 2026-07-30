# Checklist — Contract-First

Marcar todos antes de mergear la feature.

- [ ] El contrato en `specs/001-games-search/contracts/games-search.openapi.yaml` fue el
      primer archivo modificado en esta feature.
- [ ] Los Zod schemas reproducen 1:1 los `components.schemas` del contrato.
- [ ] El OpenAPI generado desde Zod (`npm run openapi:export`) es idéntico al de diseño
      (test de contrato en CI).
- [ ] Ningún endpoint responde un shape no declarado en el YAML.
- [ ] Los códigos de error (`VALIDATION_ERROR`, `UPSTREAM_ERROR`, `INTERNAL_ERROR`,
      `NOT_FOUND`) coinciden con el enum del contrato.
- [ ] `/docs` sirve el mismo YAML que se versiona.
