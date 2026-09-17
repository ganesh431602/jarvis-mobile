import { randomUUID } from "node:crypto";
import { PermissionKey, ProjectStatus, ClientStatus } from "@jarvis/shared";
import type { DashboardSummary } from "@jarvis/shared";
import { evaluateSecurityAction } from "../security/security-policy.js";
import type { SecurityIdentity, LockService } from "../security/security-policy.js";
import type { ClientService } from "./client-service.js";
import type { TaskService } from "../tasks/task-service.js";

export interface DashboardService {
  getSummary(actor: SecurityIdentity): DashboardSummary;
}

export class DefaultDashboardService implements DashboardService {
  constructor(
    private readonly clients: ClientService,
    private readonly tasks: TaskService,
    private readonly locks: LockService,
    private readonly policyVersion = "phase1",
  ) {}

  getSummary(actor: SecurityIdentity): DashboardSummary {
    const decision = evaluateSecurityAction({
      action: "dashboard.read",
      permission: PermissionKey.READ,
      module: "dashboard",
      resourceType: "dashboard",
      resourceId: "dashboard",
      risk: undefined,
      resourceScope: { module: "dashboard" },
    }, actor, this.locks, this.policyVersion, true);
    if (decision.decision !== "SAFE") throw new Error(decision.code);

    return {
      agentCount: 0,
      activeTaskCount: this.tasks.list().filter((task) => task.status === "IN_PROGRESS").length,
      pendingApprovalCount: 0,
      generatedAt: new Date().toISOString(),
    } as DashboardSummary;
  }
}
