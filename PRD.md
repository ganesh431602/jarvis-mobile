# JARVIS Product Requirements Document

## Product vision

JARVIS is a modular, mobile-first AI Business Operating System for founders, operators, and small businesses. It unifies business operations, tasks, clients, communications, financial visibility, security, approvals, and future AI-assisted execution while keeping humans in control of consequential actions.

## Users and use cases

| User | Primary use |
|---|---|
| Owner / founder | See business state, manage work, approve risk, configure policy |
| Admin | Administer authorized users and operational configuration |
| Operator | Execute permitted workflows within assigned scope |
| Viewer | Read permitted operational information |
| AI agent | Independent system actor with explicit identity, scope, permissions, and risk ceiling; never a human user |

## Core modules

**Core:** Auth, Dashboard, Tasks, Clients, Agents, Approvals, Security, Audit.

**Operations:** Communications, Content, Finance, Integrations.

**AI:** Orchestrator, Memory, Tool Gateway, Voice, Agent Registry.

## Product principles

- Human-controlled, security-first, action-oriented, modular, mobile-first, and desktop-capable.
- AI is functionality, not decoration.
- No fabricated data; real, unavailable, empty, loading, and error states remain distinct.
- Consequential actions require explicit approval unless an explicit policy permits otherwise.
- Behavior is observable, auditable, and provider-agnostic.

## MVP requirements

1. Authentication foundation and session boundaries.
2. Read-oriented dashboard.
3. Security Center with security state and emergency LOCK ALL controls.
4. Roles, permissions, resource scopes, and agent risk ceilings.
5. Approval Center for consequential actions.
6. Append-only Audit Log.
7. Agent Registry for the planned agents.
8. Task and Client foundations.
9. Integration inventory and Finance visibility foundations.
10. AI usage visibility and configuration foundations.
11. Responsive mobile-first UI, with polished desktop behavior.
12. Source-of-truth documentation and AI coding guidance.

## Agent registry

The planned registry contains CEO/Orchestrator, Business, Client, Developer, QA, Sales, Finance, Email, Content, Creator Revenue, Portfolio, Security, and Analytics. Registry presence is not proof of autonomous execution: an entry may be a placeholder identity or capability boundary.

## Current, planned, and future

- **Current:** The recorded project history identifies completed foundation, shared contracts, backend, adapter, security, agent/task, client/dashboard, frontend shell, and dashboard batches. Existing implementation is authoritative; documentation must not upgrade a placeholder into a completed feature.
- **Planned:** Dashboard polish, informational and operational modules, hardening, verification, and production boundaries listed in `IMPLEMENTATION_PLAN.md`.
- **Future:** Real provider-backed AI execution, external integrations, scheduler, multi-agent workflows, production authentication/database, and voice.

Unless verified in source, real AI execution, payments or transfers, OAuth integrations, and voice are not implemented. Finance excludes bank login, UPI PIN, ATM PIN, OTP handling, credentials, and automatic money transfer. High-risk autonomous actions are excluded from the MVP.

## Non-functional requirements

Security and least privilege are authoritative. APIs are typed and observable. Sensitive actions are auditable and approval-gated. UI is accessible, responsive, and honest about data state. Deployments must be reproducible, errors safe for users, and provider dependencies isolated behind adapters.

See `TRD.md`, `ARCHITECTURE.md`, `RULES.md`, and `DATABASE_SCHEMA.md` for technical constraints.
