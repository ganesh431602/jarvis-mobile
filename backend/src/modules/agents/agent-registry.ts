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
  { id: "ceo-orchestrator", name: "CEO / Orchestrator", department: "orchestration", description: "Coordinates approved business workflows.", permissions: [PermissionKey.READ, PermissionKey.CREATE, PermissionKey.UPDATE], riskCeiling: ceiling(AgentRiskLevel.MEDIUM) },
  { id: "business", name: "Business", department: "business", description: "Business planning and analysis.", permissions: [PermissionKey.READ, PermissionKey.CREATE], riskCeiling: ceiling(AgentRiskLevel.LOW) },
  { id: "client", name: "Client", department: "client", description: "Client workflow assistance.", permissions: [PermissionKey.READ, PermissionKey.CREATE, PermissionKey.UPDATE], riskCeiling: ceiling(AgentRiskLevel.MEDIUM) },
  { id: "developer", name: "Developer", department: "engineering", description: "Development planning assistance.", permissions: [PermissionKey.READ, PermissionKey.CREATE, PermissionKey.UPDATE], riskCeiling: ceiling(AgentRiskLevel.MEDIUM) },
  { id: "qa", name: "QA", department: "engineering", description: "Quality assurance planning assistance.", permissions: [PermissionKey.READ, PermissionKey.CREATE], riskCeiling: ceiling(AgentRiskLevel.MEDIUM) },
  { id: "sales", name: "Sales", department: "sales", description: "Sales planning assistance.", permissions: [PermissionKey.READ, PermissionKey.CREATE], riskCeiling: ceiling(AgentRiskLevel.LOW) },
  { id: "finance", name: "Finance", department: "finance", description: "Informational finance analysis only.", permissions: [PermissionKey.READ], riskCeiling: ceiling(AgentRiskLevel.LOW) },
  { id: "email", name: "Email", department: "communications", description: "Draft communication assistance only.", permissions: [PermissionKey.READ, PermissionKey.CREATE], riskCeiling: ceiling(AgentRiskLevel.MEDIUM) },
  { id: "content", name: "Content", department: "content", description: "Content drafting assistance.", permissions: [PermissionKey.READ, PermissionKey.CREATE, PermissionKey.UPDATE], riskCeiling: ceiling(AgentRiskLevel.MEDIUM) },
  { id: "creator-revenue", name: "Creator Revenue", department: "revenue", description: "Informational creator revenue analysis.", permissions: [PermissionKey.READ], riskCeiling: ceiling(AgentRiskLevel.LOW) },
  { id: "portfolio", name: "Portfolio", department: "portfolio", description: "Portfolio planning assistance.", permissions: [PermissionKey.READ, PermissionKey.CREATE], riskCeiling: ceiling(AgentRiskLevel.LOW) },
  { id: "security", name: "Security", department: "security", description: "Security analysis assistance without policy control.", permissions: [PermissionKey.READ], riskCeiling: ceiling(AgentRiskLevel.MEDIUM) },
  { id: "analytics", name: "Analytics", department: "analytics", description: "Analytics and reporting assistance.", permissions: [PermissionKey.READ, PermissionKey.CREATE], riskCeiling: ceiling(AgentRiskLevel.LOW) },
];
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

