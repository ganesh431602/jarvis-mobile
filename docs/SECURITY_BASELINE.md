# JARVIS Security Baseline

Security baseline follows OWASP Top 10:2025 and OWASP API Security Top 10.

Mandatory controls:
- Backend authoritative authentication and authorization
- Object-level and function-level authorization
- Default-deny permissions and scopes
- Agent risk ceilings and tool allowlists
- Emergency LOCK ALL enforcement before side effects
- Expiring, parameter-bound, single-use approvals
- Canonical parameter hashing
- Append-only audit events
- No credentials in logs, metadata, source, frontend, or Git
- HTTPS-only outbound integrations
- SSRF protection
- Strict request validation and resource limits
- Security headers and CSP
- Dependency vulnerability scanning
- File type and size restrictions
- Production secret manager
- Supabase RLS for browser-accessible data
- Supabase secret/service credentials backend-only
- Rate limiting with a shared production store
- Centralized safe error responses
- Security testing in CI
- No debug/admin endpoints exposed in production
- TLS at the production edge
- Backups and tested recovery
- Monitoring and alerting for authentication, authorization, approval, lock, credential, and destructive-action anomalies

This baseline reduces attack surface but does not make the system mathematically "hack-proof".
