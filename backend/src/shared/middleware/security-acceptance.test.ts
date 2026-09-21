import { agentRiskAllows } from "./agent-risk-policy.js";
import { isToolAllowed } from "./tool-allowlist.js";
import { secureExecute } from "./secure-execution.js";

const agent = {
  agentId: "agent-1",
  maxRisk: "HIGH" as const,
  enabled: true,
};

if (!agentRiskAllows(agent, "HIGH")) {
  throw new Error("Agent must allow risk within its ceiling.");
}

if (agentRiskAllows(agent, "CRITICAL")) {
  throw new Error("Agent must reject risk above its ceiling.");
}

if (!isToolAllowed("deploy", "deploy", "HIGH")) {
  throw new Error("Allowed tool must pass.");
}

if (isToolAllowed("deploy", "deploy", "CRITICAL")) {
  throw new Error("Tool risk above ceiling must be rejected.");
}

if (isToolAllowed("unknown-tool", "read", "LOW")) {
  throw new Error("Unknown tools must be rejected.");
}

try {
  await secureExecute({
    identity: {
      userId: "owner-1",
      role: "Owner",
      sessionId: "session-1",
    },
    permission: "deploy",
    scope: {
      resourceType: "deployment",
      resourceIds: ["deployment-1"],
    },
    action: "deploy",
    resourceType: "deployment",
    resourceId: "deployment-1",
    parameters: {},
    risk: {
      action: "deploy",
      permission: "deploy",
      destructive: true,
    },
    locks: [
      {
        id: "lock-1",
        scope: "GLOBAL",
        reason: "Emergency stop",
        createdBy: "owner-1",
        createdAt: "2030-01-01T00:00:00.000Z",
        version: 1,
        active: true,
      },
    ],
    policyVersion: "1",
    execute: () => "must-not-run",
    audit: () => undefined,
  });

  throw new Error("LOCK must block execution.");
} catch (error) {
  if (!(error instanceof Error) || !error.message.includes("locked")) {
    throw error;
  }
}

try {
  await secureExecute({
    identity: {
      userId: "owner-1",
      role: "Owner",
      sessionId: "session-1",
    },
    permission: "deploy",
    scope: {
      resourceType: "deployment",
      resourceIds: ["deployment-1"],
    },
    action: "deploy",
    resourceType: "deployment",
    resourceId: "deployment-1",
    parameters: {},
    risk: {
      action: "deploy",
      permission: "deploy",
      destructive: true,
    },
    locks: [],
    policyVersion: "1",
    execute: () => "must-not-run",
    audit: () => undefined,
  });

  throw new Error("HIGH-risk execution without approval must be blocked.");
} catch (error) {
  if (!(error instanceof Error) || !error.message.includes("approval")) {
    throw error;
  }
}
