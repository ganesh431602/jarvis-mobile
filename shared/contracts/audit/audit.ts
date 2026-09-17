import type { ActorRef, ISODateTime, Metadata } from "../../types/security.js";
import type { AgentRiskLevel, AuditResult } from "../../enums/index.js";
/** Metadata must never contain secrets, tokens, passwords, or credential values. */
export interface AuditEvent { eventId: string; timestamp: ISODateTime; actor: ActorRef; sessionId?: string; requestId?: string; correlationId?: string; action: string; resourceType?: string; resourceId?: string; result: AuditResult; riskLevel: AgentRiskLevel; policyVersion?: string; reason?: string; errorCode?: string; metadata?: Metadata; }
