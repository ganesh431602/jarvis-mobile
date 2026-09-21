export type AuditResult = "ALLOWED" | "DENIED" | "FAILED" | "SUCCEEDED";

export interface AuditEvent {
  readonly eventId: string;
  readonly timestamp: string;
  readonly actorId: string;
  readonly actorType: "USER" | "AGENT" | "SYSTEM";
  readonly sessionId?: string;
  readonly requestId?: string;
  readonly action: string;
  readonly resourceType: string;
  readonly resourceId?: string;
  readonly result: AuditResult;
  readonly risk: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  readonly policyVersion: string;
  readonly reason?: string;
  readonly correlationId?: string;
  readonly idempotencyKey?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export const createAuditEvent = (
  event: AuditEvent,
): AuditEvent => Object.freeze({
  ...event,
  metadata: event.metadata ? Object.freeze({ ...event.metadata }) : undefined,
});

export const assertSafeAuditMetadata = (
  metadata: Readonly<Record<string, unknown>> | undefined,
): void => {
  if (!metadata) return;

  const forbidden = /password|secret|token|api[_-]?key|authorization|cookie|otp|pin/i;

  for (const key of Object.keys(metadata)) {
    if (forbidden.test(key)) {
      throw new Error("Sensitive credential data cannot be written to audit metadata.");
    }
  }
};
