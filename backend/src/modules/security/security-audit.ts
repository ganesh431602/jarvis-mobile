import type { AuditEvent } from "@jarvis/shared";
import type { AppendOnlyRepository } from "../../infra/repositories/repository.js";

export interface SecurityAuditService {
  record(event: AuditEvent): Promise<void>;
}

export class InMemorySecurityAuditService implements SecurityAuditService {
  private readonly events: AuditEvent[] = [];
  constructor(private readonly repository?: AppendOnlyRepository<AuditEvent>) {}
  async record(event: AuditEvent): Promise<void> {
    await this.repository?.append(event);
    this.events.push(Object.freeze({ ...event }));
  }
  inspect(): readonly AuditEvent[] { return [...this.events]; }
}
