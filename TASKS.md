# JARVIS Execution Plan

Statuses: `DONE`, `IN_PROGRESS`, `BLOCKED`, `PLANNED`. Each batch is intentionally small so an AI agent cannot attempt the entire project in one prompt.

## Recorded batches

| ID | Title | Objective | Dependencies | Expected scope | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| BATCH-01 | Foundation | Establish project foundations | None | Repository/app foundations | Foundation exists and is documented | DONE |
| BATCH-02 | Shared Contracts | Define typed cross-layer contracts | BATCH-01 | Shared contract modules | Contracts are typed and consumed consistently | DONE |
| BATCH-03 | Backend Foundation | Establish Node/TypeScript/Express backend boundaries | BATCH-02 | Backend app and domain foundations | Backend starts/builds according to repository scripts | DONE |
| BATCH-04 | Supabase Adapter Boundary | Isolate platform/data adapter concerns | BATCH-03 | Provider/repository adapter boundary | Supabase does not contain business logic | DONE |
| BATCH-05 | Security Foundation | Establish identity, policy, permissions, lock, and audit foundations | BATCH-03/04 | Backend security modules | Default-deny and fail-closed rules are represented | DONE |
| BATCH-06 | Agents + Tasks | Establish agent registry and task foundation | BATCH-02/05 | Agents/tasks domains | Placeholder agents are not presented as autonomous execution | DONE |
| BATCH-07 | Clients + Dashboard Backend | Establish client and read-oriented dashboard foundations | BATCH-03/05/06 | Client/dashboard backend modules | Dashboard reads backend data without fabrication | DONE |
| BATCH-08 | Frontend Shell | Establish responsive frontend shell | BATCH-02/07 | Frontend app/layout/navigation | Mobile and desktop shells follow design rules | DONE |
| BATCH-09A | Dashboard | Deliver dashboard UI | BATCH-08 | Dashboard feature and styles | TypeScript typecheck PASS; Vite production build PASS | DONE |

The statuses above are the recorded project plan supplied for this repository. The inspected current snapshot contains only `README.md`, so implementation files and historical verification cannot be independently revalidated from that snapshot. Do not use this note to invent or backfill missing implementation.

## Next planned batches

| ID | Title | Objective | Dependencies | Expected scope | Acceptance criteria | Status |
|---|---|---|---|---|---|---|
| BATCH-09B | Informational modules | Add safe informational views and explicit data states | BATCH-09A | Read-oriented security, permissions, agent, and integration surfaces | Loading/unavailable/empty/error states are accurate; typecheck/build pass | PLANNED |
| BATCH-10 | Operational modules | Add bounded operational workflows | BATCH-09B, security foundation | Tasks, clients, approvals, and configuration UI | Consequential actions are approval-gated and audited | PLANNED |
| BATCH-11 | CI/integration verification | Automate typecheck, build, and integration checks | BATCH-10 | CI and verification configuration | Checks run reproducibly without new undocumented dependencies | PLANNED |
| FUTURE-VOICE | Voice architecture | Design, not production implementation, for voice gateway and conversation service | Security/policy contracts | Architecture and threat model only | Languages, interruption, latency, and approval boundaries documented | PLANNED |
| FUTURE-INTEGRATIONS | Real integrations | Add provider adapters for approved external services | BATCH-11, provider decisions | OAuth/provider adapters | Secrets isolated; scopes and revoke behavior tested | PLANNED |
| FUTURE-AI-TOOLS | AI/tool execution | Enable bounded provider-backed AI and tools | Security, approvals, integrations | Orchestration and tool gateway | AI cannot self-authorize; high/critical actions require approval | PLANNED |
| FUTURE-AUTH | Production authentication | Select and integrate production identity provider | Architecture decision | Auth adapter and session policy | Identity lifecycle and recovery are documented and tested | PLANNED |
| FUTURE-DATABASE | Production database integration | Select and integrate production persistence | Adapter boundary, deployment decision | Database repositories/migrations | Data access remains behind backend interfaces | PLANNED |

Every future task must include ID, title, objective, scope, dependencies, expected files/modules, acceptance criteria, and status before implementation begins.
