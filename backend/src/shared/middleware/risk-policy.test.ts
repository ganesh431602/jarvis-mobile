import {
  classifyRisk,
  maxRisk,
  requiresApproval,
} from "./risk-policy.js";

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message);
  }
};

assert(
  classifyRisk({
    action: "read_client",
    permission: "read",
    requestedRisk: "LOW",
  }) === "LOW",
  "Routine read should remain LOW risk.",
);

assert(
  classifyRisk({
    action: "delete_client",
    permission: "delete",
    destructive: true,
  }) === "HIGH",
  "Destructive actions must be HIGH risk.",
);

assert(
  classifyRisk({
    action: "transfer_money",
    permission: "financial_action",
    financial: true,
  }) === "CRITICAL",
  "Financial actions must be CRITICAL.",
);

assert(
  classifyRisk({
    action: "unknown_action",
  }) === "CRITICAL",
  "Unknown actions must default to CRITICAL.",
);

assert(requiresApproval("HIGH"), "HIGH risk requires approval.");
assert(requiresApproval("CRITICAL"), "CRITICAL risk requires approval.");
assert(!requiresApproval("MEDIUM"), "MEDIUM risk should not require approval by default.");

assert(
  maxRisk("LOW", "HIGH", "MEDIUM") === "HIGH",
  "Highest risk must win.",
);

assert(
  maxRisk("HIGH", "CRITICAL") === "CRITICAL",
  "CRITICAL risk must win.",
);
