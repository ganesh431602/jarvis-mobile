import type { AuditEvent } from "./audit-event.js";

export interface AuditEventRepository {
  append(event: AuditEvent): void;
  list(): readonly AuditEvent[];
}

export class InMemoryAuditEventRepository implements AuditEventRepository {
  private readonly events: AuditEvent[] = [];
  private readonly eventIds = new Set<string>();

  append(event: AuditEvent): void {
    if (this.eventIds.has(event.eventId)) {
      throw new Error("Duplicate audit event.");
    }

    this.eventIds.add(event.eventId);
    this.events.push(event);
  }

  list(): readonly AuditEvent[] {
    return Object.freeze([...this.events]);
  }
}
