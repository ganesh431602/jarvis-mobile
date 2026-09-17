# Security model

The backend is the authoritative security boundary and defaults to deny/fail closed. Authentication establishes identity; `permissions` owns capability definitions and authorization checks; `security` owns middleware, deterministic risk classification, security policies, and global/scoped Emergency `LOCK_ALL` controls.

Owner, Admin, Operator, Viewer, and agent identities are scoped by least privilege. High-impact actions require approval before execution; approvals are expiring, single-use, and parameter-bound, with dual approval for critical actions where policy requires. Audit events are append-only and contain actor, agent, action, resource, result, and risk metadata without secrets.

AI may propose actions but cannot authorize itself. Tool allowlists, server-side permission checks, locks, and approval policies apply before execution. Secrets never enter logs, UI responses, Git, or ordinary JSONB. The Supabase service-role key, when eventually used, remains server-side inside the adapter boundary and never reaches frontend code.
