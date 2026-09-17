# Agent module

The registry is an in-memory metadata boundary only. It contains no prompts, AI providers, tools, autonomous execution, or external integrations. Agent identities have explicit permissions, scopes, and risk ceilings and never inherit human owner/admin authority.

Persistence can later implement `AgentRepository` without changing registry/service logic.
