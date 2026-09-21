import { InMemoryAuditEventRepository } from "./audit-event-repository.js";
import { createAuditEvent } from "./audit-event.js";

const repository = new InMemoryAuditEventRepository();

const event = createAuditEvent({
  eventId: "event-1",
  timestamp: "2030-01-01T00:00:00.000Z",
  actorId: "agent-1",
  actorType: "AGENT",
  action: "deploy",
  resourceType: "deployment",
  resourceId: "deployment-1",
  result: "SUCCEEDED",
  risk: "HIGH",
  policyVersion: "1",
});

repository.append(event);

try {
  repository.append(event);
  throw new Error("Duplicate audit event must be rejected.");
} catch (error) {
  if (!(error instanceof Error) || !error.message.includes("Duplicate")) {
    throw error;
  }
}

if (repository.list().length !== 1) {
  throw new Error("Duplicate event must not be persisted.");
}

const second = createAuditEvent({
  ...event,
  eventId: "event-2",
});

repository.append(second);

if (repository.list().length !== 2) {
  throw new Error("Distinct audit events must both persist.");
}
