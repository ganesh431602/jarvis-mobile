import { createHash } from "node:crypto";
import type { ApprovalRequest } from "./approval-policy.js";

export interface ApprovalExecutionContext {
  readonly action: string;
  readonly resourceType: string;
  readonly resourceId?: string;
  readonly parameters: unknown;
  readonly policyVersion: string;
}

export const hashApprovalParameters = (parameters: unknown): string =>
  createHash("sha256")
    .update(JSON.stringify(parameters))
    .digest("hex");

export const approvalMatchesExecution = (
  approval: ApprovalRequest,
  context: ApprovalExecutionContext,
): boolean => {
  if (approval.status !== "APPROVED") {
    return false;
  }

  if (approval.action !== context.action) {
    return false;
  }

  if (approval.resourceType !== context.resourceType) {
    return false;
  }

  if (approval.resourceId !== context.resourceId) {
    return false;
  }

  if (approval.policyVersion !== context.policyVersion) {
    return false;
  }

  return approval.parametersHash === hashApprovalParameters(context.parameters);
};
