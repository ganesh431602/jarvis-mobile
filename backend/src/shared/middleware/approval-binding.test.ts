import {
  approvalMatchesExecution,
  hashApprovalParameters,
} from "./approval-binding.js";
import type { ApprovalRequest } from "./approval-policy.js";

const parameters = {
  target: "project-1",
  environment: "production",
};

const approval: ApprovalRequest = {
  id: "approval-1",
  actorId: "agent-1",
  action: "deploy",
  resourceType: "deployment",
  resourceId: "deployment-1",
  risk: "HIGH",
  parametersHash: hashApprovalParameters(parameters),
  policyVersion: "1",
  expiresAt: "2030-01-01T00:00:00.000Z",
  status: "APPROVED",
};

const context = {
  action: "deploy",
  resourceType: "deployment",
  resourceId: "deployment-1",
  parameters,
  policyVersion: "1",
};

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message);
  }
};

assert(
  approvalMatchesExecution(approval, context),
  "Exact approved execution must match.",
);

assert(
  !approvalMatchesExecution(
    approval,
    { ...context, resourceId: "deployment-2" },
  ),
  "Different resource must be rejected.",
);

assert(
  !approvalMatchesExecution(
    approval,
    {
      ...context,
      parameters: {
        target: "project-2",
        environment: "production",
      },
    },
  ),
  "Changed parameters must be rejected.",
);

assert(
  !approvalMatchesExecution(
    approval,
    { ...context, policyVersion: "2" },
  ),
  "Changed policy version must be rejected.",
);
