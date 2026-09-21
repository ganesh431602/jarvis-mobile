export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED" | "CONSUMED";

export interface ApprovalRequest {
  readonly id: string;
  readonly actorId: string;
  readonly action: string;
  readonly resourceType: string;
  readonly resourceId?: string;
  readonly risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  readonly parametersHash: string;
  readonly policyVersion: string;
  readonly expiresAt: string;
  readonly status: ApprovalStatus;
}

export interface ApprovalDecision {
  readonly approvalId: string;
  readonly reviewerId: string;
  readonly approved: boolean;
  readonly reason: string;
  readonly decidedAt: string;
}

export const approvalIsValid = (
  request: ApprovalRequest,
  now: Date,
): boolean =>
  request.status === "APPROVED" &&
  new Date(request.expiresAt).getTime() > now.getTime();

export const consumeApproval = (
  request: ApprovalRequest,
  now: Date,
): ApprovalRequest => {
  if (!approvalIsValid(request, now)) {
    throw new Error("Approval is invalid, expired, or already consumed.");
  }

  return Object.freeze({
    ...request,
    status: "CONSUMED",
  });
};
