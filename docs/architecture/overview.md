# Architecture overview

JARVIS is a modular monorepo with an independent Android client. The future web flow is:

`frontend → REST API → backend modules → repository interfaces → Supabase/PostgreSQL adapter`

`shared/` is the contract boundary. Frontend never accesses Supabase. Backend domain logic never depends directly on the Supabase SDK. Modules are added through explicit registration and interfaces, not shared mutable internals.

The Phase 1 implementation order is shared contracts, backend boundaries, adapter interfaces, domain modules, frontend shell/features, then reviewed migrations.
