import type { AgentRiskCeiling, ISODateTime, Metadata, ResourceScope } from "../../types/security.js";
import type { AgentRiskLevel, AgentStatus, PermissionKey } from "../../enums/index.js";
export interface Agent { id: string; name: string; department: string; description?: string; status: AgentStatus; enabled: boolean; permissions: readonly PermissionKey[]; riskCeiling: AgentRiskCeiling; providerKey?: string; createdAt: ISODateTime; updatedAt: ISODateTime; metadata?: Metadata; }
export interface AgentCapability { key: PermissionKey; scope?: ResourceScope; riskCeiling?: AgentRiskLevel; }
