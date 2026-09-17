import { ActionDecision, type AgentRiskLevel, type PermissionKey } from "@jarvis/shared";
import type { AuthContext, AuthScope } from "./auth-context.js";

export interface AuthorizationRequest {
  readonly context?: AuthContext;
  readonly permission: PermissionKey;
  readonly scope?: AuthScope;
  readonly risk?: AgentRiskLevel;
  readonly agentRiskCeiling?: AgentRiskLevel;
  readonly lockState?: "ACTIVE" | "INACTIVE";
  readonly approvalRequired?: boolean;
  readonly approvalSatisfied?: boolean;
}

export interface AuthorizationService {
  authorize(request: AuthorizationRequest): Promise<ActionDecision>;
}

export const denyByDefaultAuthorization: AuthorizationService = {
  async authorize(): Promise<ActionDecision> { return ActionDecision.BLOCKED; },
};
