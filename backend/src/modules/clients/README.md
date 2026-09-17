import { ActionDecision, PermissionKey } from "@jarvis/shared";
import type { DashboardSummary } from "@jarvis/shared";
import { evaluateSecurityAction } from "../security/security-policy.js";
import type { LockService, SecurityIdentity } from "../security/security-policy.js";

export interface DashboardTaskReader {
  readonly list: () => readonly Array<{ readonly status?: string }>;
}

export interface DashboardAgentReader {
  readonly list: () => readonly Array<{ readonly enabled?: boolean; readonly status?: string }>;
}

export interface DashboardService {
  getSummary(actor: SecurityIdentity): DashboardSummary;
}

export class DefaultDashboardService implements DashboardService {
  constructor(
    private readonly taskReader: DashboardTaskReader,
    private readonly agentReader: DashboardAgentReader,
    private readonly locks: LockService,
    private readonly policyVersion = "phase1",
  ) {}

  getSummary(actor: SecurityIdentity): DashboardSummary {
    const decision = evaluateSecurityAction(
      {
        action: "dashboard.read",
        permission: PermissionKey.READ,
        module: "dashboard",
        resourceType: "dashboard",
        resourceId: "dashboard",
        risk: undefined,
        resourceScope: { module: "dashboard" },
      },
      actor,
      this.locks,
      this.policyVersion,
      true,
    );
    if (decision.decision !== ActionDecision.SAFE) throw new Error(decision.code);

    return {
      agentCount: this.agentReader.list().filter((agent) => agent.enabled !== false && agent.status !== "INACTIVE").length,
      activeTaskCount: this.taskReader.list().filter((task) => task.status === "IN_PROGRESS").length,
      pendingApprovalCount: 0,
      generatedAt: new Date().toISOString(),
    } as DashboardSummary;
  }
}
