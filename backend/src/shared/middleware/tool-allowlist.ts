import type { Permission } from "./authorization.js";

export interface ToolDefinition {
  readonly name: string;
  readonly permission: Permission;
  readonly maxRisk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  readonly enabled: boolean;
}

const tools: readonly ToolDefinition[] = [
  {
    name: "deploy",
    permission: "deploy",
    maxRisk: "HIGH",
    enabled: true,
  },
  {
    name: "read_dashboard",
    permission: "read",
    maxRisk: "LOW",
    enabled: true,
  },
];

export const isToolAllowed = (
  name: string,
  permission: Permission,
  risk: ToolDefinition["maxRisk"],
): boolean => {
  const tool = tools.find((item) => item.name === name);

  if (!tool || !tool.enabled) return false;
  if (tool.permission !== permission) return false;

  const rank = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    CRITICAL: 4,
  };

  return rank[risk] <= rank[tool.maxRisk];
};
