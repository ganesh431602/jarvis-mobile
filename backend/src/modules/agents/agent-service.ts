import type { Agent } from "@jarvis/shared";
import type { SecurityIdentity } from "../security/security-policy.js";
import type { AgentRegistry, RegisteredAgent } from "./agent-registry.js";

export interface AgentService {
  get(id: string): RegisteredAgent | undefined;
  list(): readonly RegisteredAgent[];
  assertUsable(id: string): RegisteredAgent;
  createPlaceholder(name: string, actor: SecurityIdentity): Agent;
}

export class DefaultAgentService implements AgentService {
  constructor(private readonly registry: AgentRegistry) {}
  get(id: string): RegisteredAgent | undefined { return this.registry.get(id); }
  list(): readonly RegisteredAgent[] { return this.registry.list(); }
  assertUsable(id: string): RegisteredAgent { return this.registry.assertUsable(id); }
  createPlaceholder(name: string, actor: SecurityIdentity): Agent { return this.registry.createPlaceholder(name, actor); }
}
