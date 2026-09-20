# JARVIS Planned Database Schema

This is a planned domain model, not a migration. It must be reconciled with actual implementation before database work begins. Use UUID primary keys and UTC timestamps unless an approved implementation decision says otherwise. Sensitive values are references or encrypted secrets, never ordinary JSONB.

## Shared conventions

Every mutable domain table should have `created_at`, `updated_at`, and an appropriate owner/scope. Use foreign keys, tenant/resource scope checks, soft deletion only where justified, and append-only audit records. Index foreign keys, status plus scope, and time-ordered operational queries. Enumerations below are policy vocabulary, not proof of database implementation.

## Entities

| Entity | Purpose and important fields | Keys/indexes/security/audit |
|---|---|---|
| `users` | Human identity: `id`, `email`, `display_name`, `role`, `status` | PK `id`; unique email; index role/status; credentials managed by auth provider; changes audited |
| `sessions` | Auth sessions: `id`, `user_id`, `expires_at`, `revoked_at`, `device_metadata` | PK `id`, FK user; index user/expiry; never store raw secrets; revocation audited |
| `agents` | Independent actors: `id`, `name`, `agent_type`, `enabled`, `risk_ceiling`, `scope` | PK `id`; index enabled/type; no human privilege inheritance; changes audited |
| `permissions` | Permission catalog: `id`, `name`, `resource`, `action`, `risk` | PK `id`; unique name; unknown permissions deny; catalog changes audited |
| `agent_permissions` | Agent grants: `agent_id`, `permission_id`, `scope`, `expires_at` | Composite PK; FKs agents/permissions; index agent/scope; grant/revoke audited |
| `tasks` | Work items: `id`, `title`, `status`, `priority`, `assignee_user_id`, `assignee_agent_id`, `scope` | PK; FKs nullable assignees; indexes status/scope/assignee; transitions audited |
| `clients` | Client records: `id`, `name`, `status`, `owner_user_id`, `scope` | PK; owner FK; indexes owner/status; sensitive access audited |
| `projects` | Optional grouping: `id`, `client_id`, `name`, `status`, `scope` | PK, client FK; index client/status; changes audited |
| `approvals` | Decision envelope: `id`, `actor_id`, `action`, `resource`, `scope`, `parameter_hash`, `risk`, `policy_version`, `expires_at`, `reviewer_id`, `decision`, `used_at` | PK; indexes pending/expiry/resource; single-use and replay protection; all decisions audited |
| `audit_events` | Append-only event: `id`, `actor_type`, `actor_id`, `action`, `resource`, `decision`, `risk`, `correlation_id`, `metadata_redacted`, `created_at` | PK; indexes actor/resource/time/correlation; append-only; never secrets |
| `integrations` | Provider connection metadata: `id`, `provider`, `status`, `scope`, `account_ref`, `last_sync_at` | PK; unique provider/account/scope; tokens in secret manager; connect/revoke audited |
| `finance_records` | Verified visibility records: `id`, `source`, `kind`, `amount`, `currency`, `occurred_at`, `status`, `scope` | PK; indexes source/time/status; no PIN/OTP/bank credentials; imports audited |
| `ai_usage` | Verified usage: `id`, `provider`, `model_ref`, `request_count`, `input_units`, `output_units`, `cost_estimate`, `period` | PK; indexes provider/period; provider data only; no prompts containing secrets |
| `security_locks` | LOCK ALL scope: `id`, `scope_type`, `scope_ref`, `action`, `active`, `reason`, `created_by`, `expires_at`, `released_by` | PK; active-scope index; server-side check; lock/unlock audited |

Additional entities require a written justification in `IMPLEMENTATION_PLAN.md` and security review. Database code and migrations are intentionally not included here.
