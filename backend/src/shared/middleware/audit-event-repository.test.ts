import { InMemoryAuditEventRepository } from "./audit-event-repository.js";
import { createAuditEvent, type AuditEvent } from "./audit-event.js";

const repository = new InMemoryAuditEventRepository();

repository.append(
  createAuditEvent({
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
  }),
);

const events = repository.list();

if (events.length !== 1 || events[0]?.eventId !== "event-1") {
  throw new Error("Audit event must be persisted.");
}

try {
  (events as AuditEvent[]).push(events[0]!);
  throw new Error("Audit repository result must be immutable.");
} catch (error) {
  if (!(error instanceof TypeError)) {
    throw error;
  }
}

if (repository.list().length !== 1) {
  throw new Error("Audit repository must remain append-only.");
}
