import type { DashboardSummary } from "@jarvis/shared";

export const getDashboardSummary = (): DashboardSummary => ({
  agentCount: 0,
  activeTaskCount: 0,
  pendingApprovalCount: 0,
  generatedAt: new Date().toISOString(),
});