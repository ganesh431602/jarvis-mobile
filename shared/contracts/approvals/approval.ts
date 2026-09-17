import type { ApprovalRequirement, ISODateTime, Metadata, ResourceScope } from "../../types/security.js";
import type { ApprovalRiskLevel, ApprovalStatus } from "../../enums/index.js";
export interface Approval { id: string; requestingUserId?: string; requestingAgentId?: string; requestedAction: string; resourceType: string; resourceId?: string; requestedScope?: ResourceScope; riskLevel: ApprovalRiskLevel; status: ApprovalStatus; metadata?: Metadata; policyVersion: string; parameterHash: string; createdAt: ISODateTime; expiresAt: ISODateTime; reviewedAt?: ISODateTime; reviewedBy?: string; decisionReason?: string; requirement?: ApprovalRequirement; }
export type ApprovalDecision = Pick<Approval, "status" | "decisionReason">;
