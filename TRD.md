# JARVIS Technical Requirements Document

## Status convention

This document separates **current/recorded** foundations from **proposed/future** architecture. Repository source and manifests are authoritative; a design statement is not evidence that code exists.

## Technical boundaries

```text
Client UI -> API boundary -> domain services -> repository/provider interfaces
                                      |-> security/policy
                                      |-> approval and audit
```

The frontend must not access a database directly. Backend authorization is authoritative. Domain logic depends on interfaces rather than provider SDKs. Supabase, when used, is a platform/data adapter and not business logic. Android/Kotlin remains isolated from web batches.

## Layers

- **Frontend:** React/Vite/TypeScript client, feature-owned UI, shared contracts, explicit data states.
- **API boundary:** authentication context, validation, routing, correlation IDs, safe responses.
- **Backend domains:** Auth, Tasks, Clients, Agents, Approvals, Security, Audit, Dashboard and later operations modules.
- **Repositories:** interfaces for persistence; implementations may use Supabase or another approved store.
- **Providers:** adapters for external APIs and AI providers; SDK details never leak into domain logic.
- **Policy:** identity, role, permission, scope, agent ceiling, lock, risk, and approval evaluation.

## AI, tools, and agents

The orchestrator coordinates bounded agents. A future Tool/Skill Gateway will validate a registry entry containing name, schemas, required permission, allowed scope, maximum risk, approval requirement, timeout, and audit policy. The allowlist lives outside the model. AI output can propose an action but cannot authorize itself.

The scheduler is a future server-side capability for explicitly registered, scoped jobs. It must re-check policy and LOCK ALL at execution time; it must not create an autonomous bypass.

## Approval and audit

High/Critical actions generally require explicit, scoped, expiring, parameter-bound, single-use approval. Financial, credential, integration, role/permission, deployment, destructive bulk, security-lock, and out-of-scope actions require stronger controls; critical recovery may require dual human approval. Audit is append-only and records actor, action, target, decision, risk, policy version, approval reference, correlation ID, and outcome.

## Voice architecture (future)

```text
Voice UI -> Voice Gateway -> Conversation Service -> Orchestrator
         -> Security Policy -> Agents/Tools
```

English, Hindi, Hinglish, interruption/barge-in, low latency, and approval before consequential actions are future requirements. Voice is not current implementation scope.

## Error handling and observability

Use server-side input validation, typed domain errors, centralized handling, safe user messages, structured logs, request/correlation IDs, metrics, and traces where available. Never expose stack traces, provider credentials, raw SQL, or unnecessary authorization details. Log security decisions and side effects without secrets.

## Scalability and reliability

Keep domains cohesive and provider adapters replaceable. Prefer idempotent commands, bounded timeouts, retry policies appropriate to the provider, replay protection, pagination, and asynchronous job boundaries for future long-running work. Every retry must consider duplicate side effects and approval expiry.

## Future markers

Production authentication, database integration, OAuth, AI-provider execution, scheduler, multi-agent workflows, and voice remain future architecture unless verified in source. No migrations or implementation code are created by this document set.
