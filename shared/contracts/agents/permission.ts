import type { AgentRiskLevel, PermissionKey, UserRole } from "../../enums/index.js";
import type { ResourceScope } from "../../types/security.js";
export interface Permission { key: PermissionKey; description: string; riskLevel: AgentRiskLevel; roles?: readonly UserRole[]; scope?: ResourceScope; }
