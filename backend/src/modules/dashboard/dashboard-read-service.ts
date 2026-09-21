import type { DashboardSummary } from "@jarvis/shared";

export const getDashboardSummary = (): DashboardSummary => ({
  systemStatus: "Operational",
  activeAgents: 0,
  pendingApprovals: 0,
  tasks: {
    todo: 0,
    inProgress: 0,
    waitingApproval: 0,
    failed: 0,
  },
  lockState: "INACTIVE",
  recentActivity: [],
  agentCount: 0,
  activeTaskCount: 0,
  pendingApprovalCount: 0,
  generatedAt: new Date().toISOString(),
});