# Checklist — Review de PR

- [ ] `spec.md`, `plan.md`, `tasks.md` actualizados si el alcance cambió.
- [ ] Tests unit + integration + contract en verde.
- [ ] Sin `any` en TypeScript salvo justificado en comentario.
- [ ] Manejo de errores centralizado (nada de `try/catch` decorativo).
- [ ] Timeouts y reintentos configurados en clientes externos.
- [ ] Sin secretos en el repo (`.env` en `.gitignore`, `.env.example` presente).
- [ ] README actualizado con nuevos endpoints / variables.
