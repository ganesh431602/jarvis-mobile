import type { Approval, ApprovalDecision } from "@jarvis/shared";
import { ApprovalStatus, AgentRiskLevel } from "@jarvis/shared";
import type { AuthContext } from "../../shared/security/auth-context.js";

export interface ApprovalPolicy {
  requiresApproval(risk: AgentRiskLevel, action: string): boolean;
  canReview(context: AuthContext): boolean;
  validateDecision(approval: Approval, decision: ApprovalDecision, context: AuthContext, now?: string): boolean;
}

export class DefaultApprovalPolicy implements ApprovalPolicy {
  requiresApproval(risk: AgentRiskLevel, action: string): boolean {
    return risk === AgentRiskLevel.HIGH || risk === AgentRiskLevel.CRITICAL || ["financial_action", "credential", "integration", "deploy", "delete", "security_policy", "lock_control"].includes(action);
  }
  canReview(context: AuthContext): boolean { return context.actor.userId !== undefined && (context.role === "OWNER" || context.role === "ADMIN"); }
  validateDecision(approval: Approval, decision: ApprovalDecision, context: AuthContext, now = new Date().toISOString()): boolean {
    if (!this.canReview(context) || approval.status !== ApprovalStatus.PENDING || approval.expiresAt <= now) return false;
    if (decision.status !== ApprovalStatus.APPROVED && decision.status !== ApprovalStatus.REJECTED) return false;
    if (approval.requestingUserId === context.actor.userId) return false;
    return true;
  }
}
