import type { AuditEvent } from "./audit-event.js";

export interface AuditEventRepository {
  append(event: AuditEvent): void;
  list(): readonly AuditEvent[];
}

export class InMemoryAuditEventRepository implements AuditEventRepository {
  private readonly events: AuditEvent[] = [];

  append(event: AuditEvent): void {
    this.events.push(event);
  }

  list(): readonly AuditEvent[] {
    return Object.freeze([...this.events]);
  }
}
