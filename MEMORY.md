# JARVIS Durable Project Memory

## LOCKED

- JARVIS is a modular, mobile-first AI Business OS.
- Backend authorization is authoritative; default deny and least privilege apply.
- AI cannot authorize itself.
- Agents have independent identity and never inherit Owner/Admin privileges.
- High/Critical actions require approval unless explicit policy permits otherwise.
- Unknown risk becomes Critical.
- LOCK ALL blocks side effects and fails closed.
- Frontend never accesses the database directly.
- Provider SDKs stay behind adapters; Supabase is not business logic.
- Audit is append-only.
- Android/Kotlin remains isolated and untouched by web batches.
- No fabricated data; dashboard is read-oriented.
- Quiet Luxury AI OS is the visual direction.

## CURRENT

Recorded completed history: foundation/docs, shared contracts, backend foundation, Supabase adapter boundary, security foundation, agent/task, clients/dashboard, frontend shell, and dashboard (9A). Existing source is authoritative; documentation must not imply more than source verifies. The repository already contains root governance files from earlier documentation work; this batch adds the missing planning documents and aligns the set with the requested responsibilities.

## PROPOSED

Planned domain model is documented in `DATABASE_SCHEMA.md`. Future tool registry, scheduler, repository implementations, provider adapters, and production verification should follow `TRD.md` and `ARCHITECTURE.md`.

## FUTURE

Real authentication, database integration, OAuth/integrations, provider-backed AI execution, scheduler, multi-agent workflows, and voice. Finance remains visibility/planning only until separately approved and secured.

## OPEN QUESTIONS

Authentication provider, database implementation, AI provider, STT provider, TTS provider, integration priority, production deployment, retention policy, and recovery/dual-approval design remain open. Do not invent answers. No credentials, payment controls, voice, or real OAuth implementation are present unless verified in source.

## Working method

AI sessions inspect first, change only the requested batch, preserve untracked/user work, avoid destructive commands, validate relevant checks, review architectural impact, and report exactly what changed.
