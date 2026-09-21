import type { RiskLevel } from "./risk-policy.js";

export interface AgentRiskPolicy {
  readonly agentId: string;
  readonly maxRisk: RiskLevel;
  readonly enabled: boolean;
}

const rank: Record<RiskLevel, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

export const agentRiskAllows = (
  policy: AgentRiskPolicy,
  requestedRisk: RiskLevel,
): boolean =>
  policy.enabled && rank[requestedRisk] <= rank[policy.maxRisk];
