# JARVIS

JARVIS is a modular AI Business Operating System. This repository contains the existing Android client and the Phase 1 JavaScript/TypeScript monorepo foundation.

## Repository boundaries

- `app/` is the existing Android application and remains independent.
- `frontend/` is the future React/Vite/TypeScript client.
- `backend/` is the future Node/Express/TypeScript application boundary.
- `shared/` is the frontend/backend contract boundary.
- `database/` documents the future Supabase/PostgreSQL migration boundary.
- `docs/` contains architecture and security decisions.

The Phase 1 foundation is intentionally non-functional: it contains no feature implementation, API endpoints, SQL, credentials, provider calls, or Supabase connection.

## Workspace

The JavaScript workspaces are `frontend`, `backend`, and `shared`. The Android Gradle project is outside the npm workspace and must not be modified by JavaScript tooling.

## Security baseline

The future backend is default-deny and fail-closed. Authorization is server-side; emergency locks, deterministic risk classification, approval-before-execution, append-only auditing, and secret isolation are mandatory boundaries. AI output can propose actions but cannot authorize them.

## Planned implementation order

1. Shared contracts and validation boundaries.
2. Backend bootstrap, configuration, and security boundaries.
3. Supabase adapter interfaces and repository abstractions.
4. Domain modules in independently testable batches.
5. Frontend shell and feature modules.
6. Database migrations only after contracts and ownership are reviewed.

See `docs/` for the approved architecture.
