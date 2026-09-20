# JARVIS Implementation Plan

Small batches are the unit of delivery. A future batch must not be marked complete until its acceptance criteria are verified against source and tests.

## Recorded history

| Batch | Scope | Status |
|---|---|---|
| 1 | Foundation/docs | COMPLETED |
| 2 | Shared contracts | COMPLETED |
| 3 | Backend foundation | COMPLETED |
| 4 | Supabase adapter boundary | COMPLETED |
| 5 | Security foundation | COMPLETED |
| 6 | Agent/task | COMPLETED |
| 7 | Clients/dashboard | COMPLETED |
| 8 | Frontend shell | COMPLETED |
| 9A | Dashboard | COMPLETED; recorded verification: TypeScript typecheck and Vite production build PASS |

These are recorded project-history claims. Existing implementation remains authoritative.

## Planned roadmap

| Phase | Batch | Objective | Acceptance gate | Status |
|---|---|---|---|---|
| 9A.1 | Dashboard polish | Improve hierarchy, responsive behavior, and state fidelity | Visual review plus typecheck/build | TODO |
| 9B | Informational modules | Security, permissions, agents, integrations, AI usage views | No fabricated data; all async states covered | TODO |
| 10 | Operational modules | Tasks, clients, approvals, configuration | Server authorization, approval, audit paths verified | TODO |
| 10.1 | Security hardening | Input validation, IDOR/injection controls, headers, rate-limit readiness | Security review and negative tests | TODO |
| 11 | Testing/CI | Repeatable typecheck, build, unit/integration checks | CI passes without source drift | TODO |
| 12 | Real authentication | Select and integrate production auth | Recovery, session, authorization tests | TODO |
| 13 | Real database | Implement approved repositories/migrations | Scope, indexes, backups, audit verified | TODO |
| 14 | Integrations | Add authorized provider adapters | Secret isolation, OAuth/scopes/revoke verified | TODO |
| 15 | Agent/tool execution | Add bounded gateway and provider AI | Tool allowlist, approval, verification, audit | TODO |
| 16 | Scheduler | Add policy-aware scheduled work | Lock/policy re-check and idempotency | TODO |
| 17 | Multi-agent workflows | Coordinate specialized agents | Independent identity and bounded delegation | TODO |
| 18 | Voice | Implement gateway/conversation flow | STT/TTS decisions, barge-in, approval UX, privacy review | TODO |

No future item is complete merely because it is documented.
