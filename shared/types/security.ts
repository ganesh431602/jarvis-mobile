export type Identifier = string;
export type ISODateTime = string;
export type Metadata = Readonly<Record<string, unknown>>;
export type ResourceScope = Readonly<{ tenantId?: Identifier; module?: string; resourceType?: string; resourceIds?: readonly Identifier[]; environment?: string }>;
export type ActorRef = Readonly<{ userId?: Identifier; agentId?: Identifier; serviceId?: Identifier }>;
export type ApprovalRequirement = Readonly<{ required: boolean; dualApproval?: boolean; expiresAt?: ISODateTime }>;
export type AgentRiskCeiling = Readonly<{ maximumRisk: import("../enums/index.js").AgentRiskLevel; scope?: ResourceScope }>;
export type EmergencyLockState = Readonly<{ status: import("../enums/index.js").EmergencyLockStatus; scope: import("../enums/index.js").EmergencyLockScope; key?: string; reason?: string; changedAt: ISODateTime; version: number }>;
