export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface RiskContext {
  readonly action: string;
  readonly permission?: string;
  readonly requestedRisk?: RiskLevel;
  readonly destructive?: boolean;
  readonly financial?: boolean;
  readonly credentialAccess?: boolean;
  readonly securitySensitive?: boolean;
}

const riskRank: Record<RiskLevel, number> = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

export const classifyRisk = (context: RiskContext): RiskLevel => {
  if (!context.action || !context.permission) {
    return "CRITICAL";
  }

  if (
    context.financial ||
    context.credentialAccess ||
    context.securitySensitive
  ) {
    return "CRITICAL";
  }

  if (context.destructive) {
    return "HIGH";
  }

  return context.requestedRisk ?? "CRITICAL";
};

export const requiresApproval = (risk: RiskLevel): boolean =>
  risk === "HIGH" || risk === "CRITICAL";

export const maxRisk = (...levels: RiskLevel[]): RiskLevel =>
  levels.reduce(
    (highest, current) =>
      riskRank[current] > riskRank[highest] ? current : highest,
    "LOW",
  );
