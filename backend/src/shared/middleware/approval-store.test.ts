import { InMemoryApprovalStore } from "./approval-store.js";
import type { ApprovalRequest } from "./approval-policy.js";

const approval: ApprovalRequest = {
  id: "approval-1",
  actorId: "agent-1",
  action: "deploy",
  resourceType: "deployment",
  resourceId: "deployment-1",
  risk: "HIGH",
  parametersHash: "hash",
  policyVersion: "1",
  expiresAt: "2030-01-01T00:00:00.000Z",
  status: "APPROVED",
};

const store = new InMemoryApprovalStore([approval]);
const consumed = store.consume(approval.id, new Date("2029-01-01T00:00:00.000Z"));

if (consumed.status !== "CONSUMED") {
  throw new Error("Approval must become consumed.");
}

try {
  store.consume(approval.id, new Date("2029-01-01T00:00:00.000Z"));
  throw new Error("Consumed approval must not be reusable.");
} catch (error) {
  if (!(error instanceof Error) || !error.message.includes("invalid")) {
    throw error;
  }
}

try {
  const expired = new InMemoryApprovalStore([
    {
      ...approval,
      id: "approval-expired",
      expiresAt: "2028-01-01T00:00:00.000Z",
    },
  ]);
  expired.consume("approval-expired", new Date("2029-01-01T00:00:00.000Z"));
  throw new Error("Expired approval must not be consumable.");
} catch (error) {
  if (!(error instanceof Error) || !error.message.includes("expired")) {
    throw error;
  }
}
