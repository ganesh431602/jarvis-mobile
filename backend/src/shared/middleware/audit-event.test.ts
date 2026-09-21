import {
  assertSafeAuditMetadata,
  createAuditEvent,
} from "./audit-event.js";

const event = createAuditEvent({
  eventId: "event-1",
  timestamp: "2030-01-01T00:00:00.000Z",
  actorId: "agent-1",
  actorType: "AGENT",
  sessionId: "session-1",
  requestId: "request-1",
  action: "deploy",
  resourceType: "deployment",
  resourceId: "deployment-1",
  result: "ALLOWED",
  risk: "HIGH",
  policyVersion: "1",
  reason: "Approved deployment",
});

if (event.eventId !== "event-1" || event.actorType !== "AGENT") {
  throw new Error("Audit event fields must be preserved.");
}

try {
  assertSafeAuditMetadata({ accessToken: "must-never-be-stored" });
  throw new Error("Sensitive metadata must be rejected.");
} catch (error) {
  if (!(error instanceof Error) || !error.message.includes("Sensitive")) {
    throw error;
  }
}

assertSafeAuditMetadata({
  target: "deployment-1",
  resultCode: 200,
});
