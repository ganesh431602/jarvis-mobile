# Security CI is mandatory before merge.

Required checks:
- npm audit --audit-level=high
- backend/shared/frontend typecheck
- backend/frontend production builds
- tracked-source secret-pattern scan
- GitHub CodeQL
- Dependabot dependency monitoring

Production authentication:
- Bearer access tokens only
- Legacy x-auth-* headers rejected
- Authentication and authorization are separate controls
- Resource-level authorization is mandatory
- Agents cannot inherit human Owner/Admin authority

Production data:
- Supabase RLS required for browser-accessible tables
- service-role/secret keys backend-only
- no secrets in frontend bundles, logs, audit metadata, Git, URLs, screenshots, or ordinary JSON
- credentials referenced by opaque IDs only

Network:
- HTTPS only
- explicit CORS allowlist
- SSRF protection for user-controlled outbound URLs
- production rate limiting must use a shared store
- outbound integrations must use allowlisted providers/domains

Operational:
- LOCK ALL blocks side effects
- high/critical actions require approval
- approvals are expiring, parameter-bound and single-use
- audit events are append-only
- security failures fail closed
