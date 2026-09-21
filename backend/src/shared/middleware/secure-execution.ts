import type { AuditEvent } from "./audit-event.js";
import { assertNotLocked, type LockContext, type SecurityLock } from "./security-lock.js";
import { approvalMatchesExecution, type ApprovalExecutionContext } from "./approval-binding.js";
import type { ApprovalRequest } from "./approval-policy.js";
import { classifyRisk, requiresApproval, type RiskContext, type RiskLevel } from "./risk-policy.js";
import { roleHasPermission, type Permission } from "./authorization.js";
import type { AuthenticatedIdentity } from "./authentication.js";
import { scopeAllows, type ResourceScope } from "./resource-scope.js";

export interface SecureExecutionRequest {
  readonly identity: AuthenticatedIdentity;
  readonly permission: Permission;
  readonly scope: ResourceScope;
  readonly action: string;
  readonly resourceType: string;
  readonly resourceId?: string;
  readonly parameters: unknown;
  readonly risk: RiskContext;
  readonly locks: readonly SecurityLock[];
  readonly approval?: ApprovalRequest;
  readonly policyVersion: string;
  readonly execute: () => unknown;
  readonly audit: (event: AuditEvent) => void;
}

export const secureExecute = async (
  request: SecureExecutionRequest,
): Promise<unknown> => {
  if (!roleHasPermission(request.identity.role, request.permission)) {
    throw new Error("Execution denied: insufficient permission.");
  }

  if (
    !scopeAllows(
      request.scope,
      request.resourceType,
      request.resourceId,
    )
  ) {
    throw new Error("Execution denied: resource scope violation.");
  }

  const risk: RiskLevel = classifyRisk(request.risk);

  const lockContext: LockContext = {
    resourceType: request.resourceType,
    resourceId: request.resourceId,
    action: request.action,
  };

  assertNotLocked(request.locks, lockContext);

  if (requiresApproval(risk)) {
    if (!request.approval) {
      throw new Error("Execution denied: approval required.");
    }

    const approvalContext: ApprovalExecutionContext = {
      action: request.action,
      resourceType: request.resourceType,
      resourceId: request.resourceId,
      parameters: request.parameters,
      policyVersion: request.policyVersion,
    };

    if (!approvalMatchesExecution(request.approval, approvalContext)) {
      throw new Error("Execution denied: approval does not match execution.");
    }
  }

  try {
    const result = await request.execute();

    request.audit({
      eventId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      actorId: request.identity.userId,
      actorType: "USER",
      sessionId: request.identity.sessionId,
      action: request.action,
      resourceType: request.resourceType,
      resourceId: request.resourceId,
      result: "SUCCEEDED",
      risk,
      policyVersion: request.policyVersion,
    });

    return result;
  } catch (error) {
    request.audit({
      eventId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      actorId: request.identity.userId,
      actorType: "USER",
      sessionId: request.identity.sessionId,
      action: request.action,
      resourceType: request.resourceType,
      resourceId: request.resourceId,
      result: "FAILED",
      risk,
      policyVersion: request.policyVersion,
      reason: error instanceof Error ? error.message : "Execution failed.",
    });

    throw error;
  }
};
