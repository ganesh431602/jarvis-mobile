import { randomUUID } from "node:crypto";
import { AgentRiskLevel, AgentStatus, PermissionKey, UserRole } from "@jarvis/shared";
import type { Agent, AgentCapability } from "@jarvis/shared";
import type { AgentRiskCeiling, ResourceScope } from "@jarvis/shared";
import type { SecurityIdentity } from "../security/security-policy.js";

export interface RegisteredAgent extends Agent {
  readonly resourceScope: ResourceScope;
}

export interface AgentRepository {
  get(id: string): RegisteredAgent | undefined;
  list(): readonly RegisteredAgent[];
  save(agent: RegisteredAgent): RegisteredAgent;
}

export class InMemoryAgentRepository implements AgentRepository {
  private readonly records = new Map<string, RegisteredAgent>();
  get(id: string): RegisteredAgent | undefined { return this.records.get(id); }
  list(): readonly RegisteredAgent[] { return [...this.records.values()]; }
  save(agent: RegisteredAgent): RegisteredAgent { this.records.set(agent.id, agent); return agent; }
}

const now = (): string => new Date().toISOString();
const ceiling = (maximumRisk: AgentRiskLevel): AgentRiskCeiling => ({ maximumRisk });
const capability = (key: PermissionKey): AgentCapability => ({ key });

const definitions: ReadonlyArray<Pick<RegisteredAgent, "id" | "name" | "department" | "description" | "permissions" | "riskCeiling">> = [
  ["ceo-orchestrator", "CEO / Orchestrator", "orchestration", "Coordinates approved business workflows.", [PermissionKey.READ, PermissionKey.CREATE, PermissionKey.UPDATE], ceiling(AgentRiskLevel.MEDIUM)],
  ["business", "Business", "business", "Business planning and analysis.", [PermissionKey.READ, PermissionKey.CREATE], ceiling(AgentRiskLevel.LOW)],
  ["client", "Client", "client", "Client workflow assistance.", [PermissionKey.READ, PermissionKey.CREATE, PermissionKey.UPDATE], ceiling(AgentRiskLevel.MEDIUM)],
  ["developer", "Developer", "engineering", "Development planning assistance.", [PermissionKey.READ, PermissionKey.CREATE, PermissionKey.UPDATE], ceiling(AgentRiskLevel.MEDIUM)],
  ["qa", "QA", "engineering", "Quality assurance planning assistance.", [PermissionKey.READ, PermissionKey.CREATE], ceiling(AgentRiskLevel.MEDIUM)],
  ["sales", "Sales", "sales", "Sales planning assistance.", [PermissionKey.READ, PermissionKey.CREATE], ceiling(AgentRiskLevel.LOW)],
  ["finance", "Finance", "finance", "Informational finance analysis only.", [PermissionKey.READ], ceiling(AgentRiskLevel.LOW)],
  ["email", "Email", "communications", "Draft communication assistance only.", [PermissionKey.READ, PermissionKey.CREATE], ceiling(AgentRiskLevel.MEDIUM)],
  ["content", "Content", "content", "Content drafting assistance.", [PermissionKey.READ, PermissionKey.CREATE, PermissionKey.UPDATE], ceiling(AgentRiskLevel.MEDIUM)],
  ["creator-revenue", "Creator Revenue", "revenue", "Informational creator revenue analysis.", [PermissionKey.READ], ceiling(AgentRiskLevel.LOW)],
  ["portfolio", "Portfolio", "portfolio", "Portfolio planning assistance.", [PermissionKey.READ, PermissionKey.CREATE], ceiling(AgentRiskLevel.LOW)],
  ["security", "Security", "security", "Security analysis assistance without policy control.", [PermissionKey.READ], ceiling(AgentRiskLevel.MEDIUM)],
  ["analytics", "Analytics", "analytics", "Analytics and reporting assistance.", [PermissionKey.READ, PermissionKey.CREATE], ceiling(AgentRiskLevel.LOW)],
].map(([id, name, department, description, permissions, riskCeiling]) => ({ id, name, department, description, permissions, riskCeiling }));

export class AgentRegistry {
  constructor(private readonly repository: AgentRepository = new InMemoryAgentRepository()) {
    if (repository.list().length === 0) {
      for (const definition of definitions) {
        const timestamp = now();
        this.repository.save({ ...definition, status: AgentStatus.ACTIVE, enabled: true, resourceScope: {}, createdAt: timestamp, updatedAt: timestamp });
      }
    }
  }

  get(id: string): RegisteredAgent | undefined { return this.repository.get(id); }
  list(): readonly RegisteredAgent[] { return this.repository.list(); }

  assertUsable(id: string): RegisteredAgent {
    const agent = this.get(id);
    if (!agent || !agent.enabled || agent.status !== AgentStatus.ACTIVE) throw new Error("AGENT_UNAVAILABLE");
    return agent;
  }

  assertCannotSelfModify(actor: SecurityIdentity, targetAgentId: string): void {
    if (actor.actor.agentId === targetAgentId && actor.permissions?.some((permission) => [PermissionKey.UPDATE, PermissionKey.SECURITY_POLICY_CHANGE, PermissionKey.LOCK_CONTROL].includes(permission))) {
      throw new Error("AGENT_SECURITY_BOUNDARY");
    }
    if (actor.actor.agentId && (actor.role === UserRole.OWNER || actor.role === UserRole.ADMIN)) throw new Error("AGENT_ROLE_FORBIDDEN");
  }

  update(id: string, patch: Pick<Partial<RegisteredAgent>, "name" | "description" | "enabled" | "status" | "resourceScope"> , actor: SecurityIdentity): RegisteredAgent {
    this.assertCannotSelfModify(actor, id);
    const current = this.assertUsable(id);
    const updated = { ...current, ...patch, updatedAt: now(), id: current.id, permissions: current.permissions, riskCeiling: current.riskCeiling };
    return this.repository.save(updated);
  }

  createPlaceholder(name: string, actor: SecurityIdentity): RegisteredAgent {
    if (!actor.actor.userId || actor.actor.agentId || !actor.permissions?.includes(PermissionKey.CREATE)) throw new Error("PERMISSION_DENIED");
    const timestamp = now();
    return this.repository.save({ id: randomUUID(), name, department: "custom", description: "User-created placeholder agent.", status: AgentStatus.INACTIVE, enabled: false, permissions: [PermissionKey.READ], riskCeiling: ceiling(AgentRiskLevel.LOW), resourceScope: {}, createdAt: timestamp, updatedAt: timestamp });
  }
}
