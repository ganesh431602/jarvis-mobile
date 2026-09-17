# Repository boundary

Repository interfaces are framework-neutral and usable by future agents, tasks, clients, approvals, audit, and finance modules. Implementations belong in infrastructure adapters; domain modules must depend only on these interfaces.

Audit persistence must use append-only interfaces. No normal update/delete contract is provided for audit events.
