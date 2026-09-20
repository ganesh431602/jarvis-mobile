# JARVIS Engineering and Security Rules

These rules are authoritative for humans and AI coding agents.

## Engineering

Inspect before modifying. Preserve existing work. Make small isolated changes, avoid unrelated formatting/refactors, prefer existing dependencies, keep APIs typed, and validate before claiming completion. Frontend never accesses the database directly. Backend authorization is authoritative.

## Authorization and agents

- Default deny unknown permissions, scopes, actions, and identities.
- Apply least privilege and server-side authorization.
- AI output can never authorize itself.
- Agents have independent identity and never inherit Owner/Admin privileges.
- High/Critical actions require approval unless explicitly allowed by policy.
- Unknown risk becomes Critical.
- LOCK ALL blocks side effects and fails closed; check it server-side immediately before execution.
- Approval never overrides an active lock.
- Approval is scoped, expiring, parameter-bound, single-use, and replay-protected.

## Secrets and providers

Never put secrets in frontend code, logs, Git, URLs, screenshots, ordinary database JSONB, or user-facing errors. Service-role credentials are server-side only. Do not hardcode credentials. Do not use provider SDKs directly in business/domain logic; use repository/provider adapters. The tool allowlist exists outside the model.

## Input and operations security

Validate all input server-side. Protect against injection, IDOR, unsafe file uploads, replay, and unauthorized privilege changes. Use strict CORS/security headers and maintain rate-limiting readiness. Sensitive operations and lock/approval decisions must be audited. Use official or authorized APIs and adapters only; no hacking, reverse engineering, circumvention, or abuse of third-party services.

## Errors and observability

Use typed errors, centralized handling, correlation IDs, structured logs, and safe production messages. Do not expose stack traces, credentials, raw SQL, or unnecessary internal authorization details. Preserve already-loaded data when refresh fails.

## UI data integrity

Distinguish `LOADING`, `EMPTY`, `UNAVAILABLE`, `ERROR`, disabled, focus, pressed, and hover states. Never fabricate revenue, activity, agents, tasks, approvals, AI usage, or metrics.

## Changes and Git

One logical batch per commit. Explain breaking changes. Do not modify package/config/source files for a documentation-only task. Never use destructive repository commands or overwrite user work without inspection. Do not weaken security for convenience.
