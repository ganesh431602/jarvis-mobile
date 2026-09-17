import type { AuditEvent, Metadata } from "@jarvis/shared";
import type { AppendOnlyRepository } from "../../infra/repositories/repository.js";

const forbidden = /password|token|secret|credential|api.?key|otp|payment|service.?role/i;
const safeMetadata = (metadata: Metadata | undefined): Metadata | undefined => {
  if (!metadata) return undefined;
  return Object.fromEntries(Object.entries(metadata).filter(([key, value]) => !forbidden.test(key) && typeof value !== "function"));
};

export interface SecurityAuditService { record(event: AuditEvent): Promise<void>; }

export class InMemorySecurityAuditService implements SecurityAuditService {
  private readonly events: AuditEvent[] = [];
  constructor(private readonly repository?: AppendOnlyRepository<AuditEvent>) {}
  async record(event: AuditEvent): Promise<void> {
    const sanitized = Object.freeze({ ...event, metadata: safeMetadata(event.metadata) });
    await this.repository?.append(sanitized);
    this.events.push(sanitized);
  }
  inspect(): readonly AuditEvent[] { return [...this.events]; }
}
