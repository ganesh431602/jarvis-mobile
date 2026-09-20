# JARVIS Application Flows

Flows describe intended behavior; current implementation must be verified before being claimed as complete.

## Authentication

```text
Client -> authentication boundary -> identity/session validation -> authorized shell
```

Authentication establishes identity only. Authorization is evaluated server-side for every protected request.

## Dashboard

```text
Open dashboard -> request read model -> LOADING -> data / EMPTY / UNAVAILABLE / ERROR
```

The dashboard is read-oriented and must never fabricate metrics, tasks, revenue, agents, or system status.

## Security Center and LOCK ALL

Security Center shows policy, lock, permission, and audit-relevant state. LOCK ALL may be global, module, agent, resource, or action scoped. Before every consequential side effect, the server checks the active lock. An active lock blocks execution and fails closed. Unlock requires an authenticated authorized human, stronger recovery controls where required, and an audit event. Approval never overrides a lock.

## Approvals

```text
Proposed action -> risk/policy evaluation -> approval request -> human review
-> approve/deny/expire -> re-check lock and policy -> execute or block -> audit
```

Approval is scoped, expiring, parameter-bound, single-use, and replay-protected.

## Agents

Registry view shows the 13 planned identities and their enabled state, permissions, scope, and risk ceiling. A registry entry does not imply execution. Agents never inherit Owner/Admin privileges.

## Tasks

Create or receive task -> validate scope -> assign permitted human/agent -> update lifecycle -> audit material changes -> report state. Future automation must pass policy before side effects.

## Clients

Open client list -> load permitted records -> view client context -> create/update within scope -> audit changes. Sensitive client information follows least privilege and safe error rules.

## Finance

Finance currently means foundation and visibility planning only. No bank login, UPI PIN, ATM PIN, OTP, credentials, payment provider execution, or automatic money transfer is included.

## Integrations

Integration Center displays provider availability and connection state. GitHub, Gmail, YouTube, Instagram, LinkedIn, cloud storage, and payment systems are future/placeholder integrations. No credentials or OAuth implementation is assumed.

## AI usage

Usage view reports only verified provider/request data. If no source is connected, show UNAVAILABLE—not invented usage. Future provider calls pass through adapters and policy; secrets remain server-side.

## Future agent execution

```text
Goal -> Plan -> Tool selection -> Permission/risk check -> Approval
-> Execute -> Verify -> Audit -> Report
```

The model may propose a plan and tool, but the policy layer and human approval control execution.

## Future voice flow

```text
Speech-to-text -> Conversation -> Intent/security -> Answer or Action Proposal
-> Approval if required -> Execute -> Text-to-speech
```

Voice UI may be mobile or web. It must support future English, Hindi, Hinglish, interruption, low latency, and explicit approval. Do not implement voice now.
