import { secureExecute } from "./secure-execution.js";
import type { AuditEvent } from "./audit-event.js";

const audits: AuditEvent[] = [];

const result = await secureExecute({
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
  parameters: { environment: "staging" },
  risk: {
    action: "deploy",
    permission: "deploy",
    requestedRisk: "LOW",
  },
  locks: [],
  policyVersion: "1",
  execute: () => "executed",
  audit: (event) => audits.push(event),
});

if (result !== "executed") {
  throw new Error("Execution result must be returned.");
}

if (audits.length !== 1 || audits[0]?.result !== "SUCCEEDED") {
  throw new Error("Successful execution must be audited.");
}

try {
  await secureExecute({
    identity: {
      userId: "viewer-1",
      role: "Viewer",
      sessionId: "session-2",
    },
    permission: "deploy",
    scope: { resourceType: "deployment" },
    action: "deploy",
    resourceType: "deployment",
    resourceId: "deployment-1",
    parameters: {},
    risk: { action: "deploy", permission: "deploy" },
    locks: [],
    policyVersion: "1",
    execute: () => "must-not-run",
    audit: () => undefined,
  });

  throw new Error("Unauthorized execution must be blocked.");
} catch (error) {
  if (!(error instanceof Error) || !error.message.includes("permission")) {
    throw error;
  }
}
