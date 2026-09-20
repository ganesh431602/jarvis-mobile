# JARVIS Product Requirements Document

## Product

**JARVIS** is a modular, mobile-first AI Business Operating System: a professional executive operating system and personal AI assistant for business operations, tasks, clients, communications, finance visibility, security, approvals, and future AI-powered automation.

## Problem

Business work is fragmented across operations, tasks, clients, communications, financial visibility, integrations, and disconnected AI tools. JARVIS is intended to unify that work while keeping humans in control of consequential actions. It must provide useful context and execution assistance without fabricating data or silently taking high-risk actions.

## Target users

- **Primary:** founder/business owner, solo entrepreneur, small-business operator, and executive/operator managing multiple workflows.
- **Secondary:** authorized administrators, operators, and view-only users.
- **System actors:** AI agents are independent system actors, not human users. They do not inherit human OWNER or ADMIN authority.

## Product principles

1. Human-controlled and security-first.
2. Action-oriented, modular, mobile-first, and desktop-capable.
3. AI is functionality, not decoration.
4. No fabricated data.
5. Consequential actions require explicit approval.
6. Behavior is observable and auditable.
7. Architecture is provider-agnostic.

## Phase 1 MVP scope

| Capability | Phase 1 expectation |
|---|---|
| Authentication foundation | Foundation and boundaries for identity and sessions |
| Dashboard | Read-oriented operational summary |
| Security Center | Security state, controls, and emergency lock surface |
| Permission model | Roles, permissions, scopes, and risk ceilings |
| Approval Center | Review and decision workflow for consequential actions |
| Audit Log | Append-only activity and security record |
| Agent Registry | Registry for the 13 placeholder agents |
| Task System | Task foundation and lifecycle |
| Client foundation | Client records and foundations for client workflows |
| Integration Center | Integration inventory and connection-state foundation |
| Finance foundation | Visibility foundations only; no money movement |
| AI usage foundation | Usage visibility and provider-agnostic boundaries |
| Configuration | Product and account configuration surfaces |
| Security controls | Locking, policy, and protective controls |
| Responsive UI | Mobile-first behavior with desktop-capable layouts |
| Documentation | Source-of-truth engineering and product documents |
| Copilot instructions | Guidance for safe, scoped AI-assisted development |

The repository snapshot inspected for this documentation contains `README.md` only. The implementation status above is the intended/project-record scope; implementation claims must be verified against the repository before being relied upon.

## Placeholder agents

The Phase 1 registry contains these 13 placeholder agents: CEO / Orchestrator, Business, Client, Developer, QA, Sales, Finance, Email, Content, Creator Revenue, Portfolio, Security, and Analytics.

A placeholder agent is an identity, registry entry, or capability boundary—not proof that autonomous execution exists. Implemented foundation, placeholder capability, future capability, and intentionally absent capability must remain distinct in UI and documentation.

- **Implemented foundation:** contracts, boundaries, registry/task/security foundations only where present and verified in the repository.
- **Placeholder capability:** agent identities and safe metadata that can be displayed or configured without claiming execution.
- **Future capability:** provider-backed tools, real integrations, and approved automation planned for later phases.
- **Intentionally not implemented:** high-risk autonomous actions, credentials, money movement, and production voice in Phase 1.

## Explicit Phase 1 exclusions

Phase 1 does **not** include real financial transfers, UPI PIN, ATM PIN, OTP handling, bank credentials, real OAuth integrations, real AI-provider execution, autonomous high-risk actions, or production voice implementation.

## Success criteria

- Users can understand operational state without invented metrics.
- Consequential actions are denied or held for scoped approval.
- Security state and audit history are observable.
- Agents are useful as bounded system actors, never as implicit owners.
- UI states distinguish loading, unavailable, empty, and error.
- Each delivery is small, verifiable, and documented.
