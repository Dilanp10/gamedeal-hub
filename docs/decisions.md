# Decisiones de arquitectura (ADRs)

Cada decisión relevante se registra aquí. Formato corto: contexto → decisión → consecuencias.

---

## ADR-0001 · Metodología Spec-Driven Development (Contract-First)
- **Fecha**: 2026-07-30
- **Contexto**: proyecto de portafolio que debe demostrar buenas prácticas modernas.
- **Decisión**: adoptar SDD con carpeta `specs/` por feature y OpenAPI como contrato.
- **Consecuencias**: más disciplina inicial; documentación siempre presente; contrato
  imposible de desincronizar del código si el CI lo verifica.

---

## ADR-0002 · Fastify + Zod (fastify-type-provider-zod)
- **Fecha**: 2026-07-30
- **Contexto**: se necesita validación runtime + tipos TS + generación OpenAPI.
- **Decisión**: Fastify por su soporte nativo de schemas; Zod como fuente única.
- **Alternativas descartadas**: Express + Ajv (más plomería, doble mantenimiento);
  YAML manual + `openapi-typescript` (drift casi garantizado).
- **Consecuencias**: dependencia clave `fastify-type-provider-zod` y `zod-to-openapi`.

---

## ADR-0003 · ID unificado como slug estable
- **Fecha**: 2026-07-30
- **Contexto**: RAWG entrega `int`, CheapShark entrega `gameID` string. Ambos son
  específicos a su proveedor.
- **Decisión**: exponer un `id` propio derivado del título canónico (`slugify`).
- **Consecuencias**: dedup entre fuentes por slug; el consumidor no depende de RAWG
  ni CheapShark. Riesgo: colisiones raras (documentadas en `backlog.md`).

---

## ADR-0004 · Moneda fija USD en v1
- **Fecha**: 2026-07-30
- **Contexto**: CheapShark solo publica precios en USD.
- **Decisión**: `currency: "USD"` explícito en el contrato.
- **Consecuencias**: no hay conversión ni configuración; cambiar esto es breaking.
