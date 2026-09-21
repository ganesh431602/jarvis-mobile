import type { ApprovalRequest } from "./approval-policy.js";

export interface ApprovalStore {
  get(id: string): ApprovalRequest | undefined;
  consume(id: string, now: Date): ApprovalRequest;
}

export class InMemoryApprovalStore implements ApprovalStore {
  private readonly approvals = new Map<string, ApprovalRequest>();

  constructor(initial: readonly ApprovalRequest[] = []) {
    for (const approval of initial) {
      this.approvals.set(approval.id, approval);
    }
  }

  get(id: string): ApprovalRequest | undefined {
    return this.approvals.get(id);
  }

  consume(id: string, now: Date): ApprovalRequest {
    const approval = this.approvals.get(id);

    if (!approval) {
      throw new Error("Approval not found.");
    }

    if (approval.status !== "APPROVED") {
      throw new Error("Approval is invalid or already consumed.");
    }

    if (new Date(approval.expiresAt).getTime() <= now.getTime()) {
      throw new Error("Approval has expired.");
    }

    const consumed: ApprovalRequest = Object.freeze({
      ...approval,
      status: "CONSUMED",
    });

    this.approvals.set(id, consumed);
    return consumed;
  }
}
