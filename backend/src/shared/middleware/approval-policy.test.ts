import {
  approvalIsValid,
  consumeApproval,
  type ApprovalRequest,
} from "./approval-policy.js";

const baseApproval: ApprovalRequest = {
  id: "approval-1",
  actorId: "agent-1",
  action: "deploy",
  resourceType: "deployment",
  resourceId: "deployment-1",
  risk: "HIGH",
  parametersHash: "sha256:test",
  policyVersion: "1",
  expiresAt: "2030-01-01T00:00:00.000Z",
  status: "APPROVED",
};

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message);
  }
};

assert(
  approvalIsValid(baseApproval, new Date("2029-01-01T00:00:00.000Z")),
  "Unexpired approval should be valid.",
);

assert(
  !approvalIsValid(
    { ...baseApproval, expiresAt: "2020-01-01T00:00:00.000Z" },
    new Date("2029-01-01T00:00:00.000Z"),
  ),
  "Expired approval must be invalid.",
);

assert(
  !approvalIsValid(
    { ...baseApproval, status: "PENDING" },
    new Date("2029-01-01T00:00:00.000Z"),
  ),
  "Pending approval must not authorize execution.",
);

const consumed = consumeApproval(
  baseApproval,
  new Date("2029-01-01T00:00:00.000Z"),
);

assert(consumed.status === "CONSUMED", "Approval must become consumed after execution.");

let replayBlocked = false;

try {
  consumeApproval(consumed, new Date("2029-01-01T00:00:00.000Z"));
} catch {
  replayBlocked = true;
}

assert(replayBlocked, "Consumed approval must not be replayable.");
