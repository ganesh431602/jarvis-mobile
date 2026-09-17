import { ApprovalStatus, AgentRiskLevel, UserRole } from "@jarvis/shared";
import type { Approval, ApprovalDecision, ResourceScope } from "@jarvis/shared";
import type { AuthContext } from "../../shared/security/auth-context.js";

export interface ApprovalExecutionRequest { readonly action: string; readonly resourceType?: string; readonly resourceId?: string; readonly scope?: ResourceScope; readonly risk: AgentRiskLevel; readonly policyVersion: string; readonly parameterHash: string; }
export interface ApprovalPolicy {
  requiresApproval(risk: AgentRiskLevel, action: string): boolean;
  canReview(context: AuthContext): boolean;
  validateDecision(approval: Approval, decision: ApprovalDecision, context: AuthContext, now?: string): boolean;
  validateExecution(approval: Approval, request: ApprovalExecutionRequest, now?: string): boolean;
}

export class DefaultApprovalPolicy implements ApprovalPolicy {
  private readonly consumed = new Set<string>();
  requiresApproval(risk: AgentRiskLevel, _action: string): boolean { return risk === AgentRiskLevel.HIGH || risk === AgentRiskLevel.CRITICAL; }
  canReview(context: AuthContext): boolean { return context.actor.userId !== undefined && context.actor.agentId === undefined && context.actor.serviceId === undefined && (context.role === UserRole.OWNER || context.role === UserRole.ADMIN); }
  validateDecision(approval: Approval, decision: ApprovalDecision, context: AuthContext, now = new Date().toISOString()): boolean {
    if (!this.canReview(context) || approval.status !== ApprovalStatus.PENDING || approval.expiresAt <= now || approval.requestingUserId === context.actor.userId || this.consumed.has(approval.id)) return false;
    return decision.status === ApprovalStatus.APPROVED || decision.status === ApprovalStatus.REJECTED;
  }
  validateExecution(approval: Approval, request: ApprovalExecutionRequest, now = new Date().toISOString()): boolean {
    if (approval.status !== ApprovalStatus.APPROVED || approval.expiresAt <= now || this.consumed.has(approval.id)) return false;
    if (approval.requestedAction !== request.action || approval.resourceType !== request.resourceType || approval.resourceId !== request.resourceId || approval.policyVersion !== request.policyVersion || approval.parameterHash !== request.parameterHash || approval.riskLevel !== request.risk || JSON.stringify(approval.requestedScope ?? {}) !== JSON.stringify(request.scope ?? {})) return false;
    this.consumed.add(approval.id);
    return true;
  }
}
