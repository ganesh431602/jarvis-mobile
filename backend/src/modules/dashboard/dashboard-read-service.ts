import { AgentRegistry } from "../agents/agent-registry.js";
import type { TaskService } from "../tasks/task-service.js";
import type { LockService } from "../security/security-policy.js";
import type { DashboardSummary } from "@jarvis/shared";

export interface DashboardDependencies {
  readonly agents: AgentRegistry;
  readonly tasks: Pick<TaskService, "list">;
  readonly locks: LockService;
}

const taskStatusMap = {
  TODO: "todo",
  IN_PROGRESS: "inProgress",
  WAITING_APPROVAL: "waitingApproval",
  FAILED: "failed",
} as const;

export const createDashboardReadService = (dependencies: DashboardDependencies) => ({
  getSummary(): DashboardSummary {
    const tasks = dependencies.tasks.list();
    const agents = dependencies.agents.list();
    const locks = dependencies.locks.inspect();
    const activeLocks = locks.filter((lock) => lock.status === "ACTIVE");

    const counts = {
      todo: 0,
      inProgress: 0,
      waitingApproval: 0,
      failed: 0,
    };

    for (const task of tasks) {
      const key = taskStatusMap[task.status as keyof typeof taskStatusMap];
      if (key) counts[key] += 1;
    }

    return {
      systemStatus: "Operational",
      activeAgents: agents.filter((agent) => agent.enabled && agent.status === "ACTIVE").length,
      pendingApprovals: counts.waitingApproval,
      tasks: counts,
      lockState: activeLocks.length > 0 ? "ACTIVE" : "INACTIVE",
      recentActivity: [],
      agentCount: agents.length,
      activeTaskCount: tasks.filter((task) => task.status === "IN_PROGRESS").length,
      pendingApprovalCount: counts.waitingApproval,
      generatedAt: new Date().toISOString(),
    };
  },
});