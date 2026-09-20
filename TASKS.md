# JARVIS Task Register

Statuses: `TODO`, `IN_PROGRESS`, `WAITING_APPROVAL`, `COMPLETED`, `FAILED`, `CANCELLED`.

| ID | Phase | Module | Task | Status | Priority | Dependencies | Notes |
|---|---|---|---|---|---|---|---|
| B1 | Foundation | Docs | Foundation and documentation | COMPLETED | High | None | Recorded history |
| B2 | Contracts | Shared | Shared contracts | COMPLETED | High | B1 | Recorded history |
| B3 | Backend | API | Backend foundation | COMPLETED | High | B2 | Recorded history |
| B4 | Data boundary | Supabase | Adapter boundary | COMPLETED | High | B3 | Supabase is not business logic |
| B5 | Security | Policy | Security foundation | COMPLETED | Critical | B3/B4 | Default deny/fail closed |
| B6 | Core | Agents/Tasks | Agent and task foundation | COMPLETED | High | B2/B5 | Registry does not imply autonomy |
| B7 | Core | Clients/Dashboard | Client and dashboard foundation | COMPLETED | High | B3/B5/B6 | Dashboard is read-oriented |
| B8 | Frontend | Shell | Responsive frontend shell | COMPLETED | High | B2/B7 | Preserve existing implementation |
| B9A | Frontend | Dashboard | Dashboard | COMPLETED | High | B8 | Recorded typecheck/build PASS |
| B9A.1 | Polish | Dashboard | Visual and responsive polish | TODO | Medium | B9A | No source changes in this documentation batch |
| B9B | Informational | Security/Agents/Integrations | Informational module states | TODO | High | B9A | Must not fabricate data |
| B10 | Operations | Tasks/Clients/Approvals | Operational workflows | TODO | High | B9B/B5 | Approval and audit required |
| B11 | Verification | CI | Typecheck/build/integration verification | TODO | High | B10 | Reproducible checks |
| B12 | Auth | Authentication | Production authentication | TODO | Critical | B5/B11 | Provider remains open |
| B13 | Data | Database | Production database integration | TODO | Critical | B4/B11 | Schema is planned only |
| B14 | Integrations | Providers | Authorized real integrations | TODO | High | B11/B13 | OAuth/credentials not implemented |
| B15 | AI | Tools/Agents | Real agent/tool execution | TODO | Critical | B5/B10/B14 | External allowlist and approval |
| B16 | Automation | Scheduler | Policy-aware scheduler | TODO | High | B15 | Idempotency and lock checks |
| B17 | AI | Multi-agent | Bounded multi-agent workflows | TODO | High | B15/B16 | No privilege inheritance |
| B18 | Voice | Voice | Future voice gateway and conversation | TODO | Medium | B5/B15 | Do not implement voice now |

Every new task requires a small scope, dependencies, expected files, acceptance criteria, and an explicit status transition.
