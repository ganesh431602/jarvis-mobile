# Agent model

Agents are registry records with stable identity, name, department, description, status, enabled state, permissions, and a risk ceiling. New agents are data/configuration additions behind shared contracts, not new core branches.

Every agent action is evaluated against identity, scope, permission, lock state, deterministic risk policy, and approval requirements. Agents cannot modify their own permissions, policy, approvals, audit history, or emergency locks. AI-provider selection will use provider-neutral interfaces.
