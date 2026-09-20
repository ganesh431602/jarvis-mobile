# JARVIS Engineering Rules

This is the non-negotiable rulebook for humans and AI coding agents.

## General AI coding rules

- Inspect before modifying and preserve existing work.
- Never rewrite working modules unnecessarily.
- Make small, isolated changes in the requested batch.
- Prefer existing dependencies; justify any new library before adding it.
- Do not duplicate abstractions; follow repository naming conventions.
- Keep modules cohesive, APIs typed, and dependencies acyclic.
- Validate changes before declaring completion.

## Security rules

The authorization decision is:

```text
Identity + Role + Permission + Resource Scope + Agent Risk Ceiling
+ Lock State + Risk Policy + Approval = ALLOW / DENY
```

- Backend is authoritative.
- Unknown permissions and scopes default to deny.
- Unknown risk is CRITICAL.
- AI output can never authorize itself.
- Agents have independent identity and never inherit OWNER or ADMIN authority.
- High-risk and critical actions require approval.
- Emergency LOCK ALL is checked before side effects; lock failure fails closed.
- Approval never overrides an active lock.
- Agents cannot modify their own security restrictions.
- Unknown actions are blocked.

## Approval rules

Approvals are scoped, expiring, parameter-bound, single-use, and replay-protected. Record actor, action, resource, scope, parameter hash, risk, policy version, creation time, expiry, reviewer, decision, and reason. Execution must re-check policy and lock state.

## Secrets rules

Never commit secrets, put secrets in the frontend, log secrets, place them in screenshots or URLs, put credentials into ordinary JSONB, or expose Supabase service-role credentials to clients.

## Error handling

Use typed errors, centralized error handling, safe user-facing messages, structured server logs, and correlation/request IDs. Never expose stack traces, provider secrets, database credentials, raw SQL errors, or unnecessary internal authorization details to users.

## UI data-state rules

Every async feature distinguishes:

| State | Meaning | Required behavior |
|---|---|---|
| `LOADING` | Request in progress | Realistic skeleton; no fake values |
| `UNAVAILABLE` | Source/capability is not connected or implemented | Muted explanation and optional setup; not an error |
| `EMPTY` | Feature works but has zero records | Normal empty state with contextual next action |
| `ERROR` | Request attempted and failed | Human-readable message, retry where appropriate, preserve loaded data |

Never fabricate revenue, activity, agents, tasks, approvals, system status, AI usage, or metrics.

## Git rules

Use small commits and one logical batch per commit. Explain breaking changes, do not modify unrelated files, and never overwrite user work without inspection.
