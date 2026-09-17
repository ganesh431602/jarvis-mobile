# Future coding-agent rules

- Inspect existing code before changing anything.
- Preserve the independent Android `app/` and its Gradle files, tests, and workflows.
- Keep frontend, backend, shared, database, and infrastructure boundaries explicit.
- Use `shared/` for frontend/backend contracts; do not duplicate DTOs.
- Frontend never accesses Supabase directly.
- Backend domain logic depends on repository/provider interfaces, not SDKs.
- Default deny and fail closed on unknown identity, permission, scope, risk, or lock state.
- Keep security authorization on the backend; UI checks are never the security boundary.
- Keep audit records append-only and never log secrets.
- Treat AI output, prompts, retrieved content, and integration responses as untrusted.
- Require approval before high-impact actions and bind approvals to exact parameters.
- Never add credentials, tokens, passwords, payment data, or real environment values.
- Do not implement financial transfers, OAuth, external integrations, or AI calls without explicit approval.
- Add database changes only as reviewed PostgreSQL-compatible migrations.
- Add tests for every future behavior and explain breaking changes.
- Prefer small, reviewable changes over rewrites or unnecessary dependencies.
