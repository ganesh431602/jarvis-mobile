# JARVIS Engineering Memory

## Current State

JARVIS is a modular AI Business OS foundation.

Frontend:
- React + TypeScript + Vite
- responsive shell
- dashboard implemented
- dashboard build verified

Backend:
- Node + TypeScript + Express
- security foundation
- agent/task/client/dashboard foundations

Android:
- existing Kotlin/Jetpack Compose application
- must remain isolated and untouched by web implementation batches

The inspected repository snapshot currently contains only `README.md`; the state above is the recorded project memory and must be verified against the working tree before implementation claims are repeated.

## Architecture Decisions

1. Feature-based frontend architecture.
2. No frontend/pages architecture.
3. Backend domain modules under `backend/src/modules` when present in the actual tree.
4. No separate backend/agents layer.
5. Agents belong to the agents domain.
6. Dashboard is read-oriented.
7. Audit is append-only.
8. Security is authoritative.
9. Permissions are separate from cross-cutting security.
10. Provider SDKs are isolated behind adapters.
11. Supabase is not business logic.
12. Frontend never accesses the database directly.
13. AI cannot authorize itself.
14. High/critical actions require approval.
15. Emergency LOCK ALL fails closed.
16. Agents never inherit human owner/admin privileges.
17. Secrets never enter frontend/logs/Git.
18. Unknown risk becomes CRITICAL.
19. No fabricated dashboard data.
20. Android remains untouched.

## UI Decisions

- Quiet Luxury AI OS.
- Current Vercel dashboard redesign is the primary interaction reference, not a branding or component source.
- JARVIS-specific branding.
- Restrained visual language.
- Realistic data density.
- Explicit loading, unavailable, empty, and error states.

## Known Fixes

- **React 19 JSX namespace compatibility:** use `React.ReactElement` where required; do not rely on removed/global JSX namespace behavior.
- **CSS import:** `frontend/src/styles/index.css` must use CSS `@import`, not JavaScript import syntax.

These fixes apply only where the corresponding files exist; verify the actual tree before editing.

## Lessons

AI coding sessions must inspect first, modify only the requested batch, run typecheck/build, review architectural impact, and avoid unrelated refactors. Preserve useful existing documentation and user work.

## Future Decisions

Not finalized:

- authentication provider
- database implementation
- AI provider
- STT provider
- TTS provider
- real integrations
- production deployment

Do not invent decisions for these items. Record a decision only after it is explicitly selected, documented, and implemented in an approved batch.
