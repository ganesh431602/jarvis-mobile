import type { ActionDecision, AgentRiskLevel, PermissionKey, UserRole } from "@jarvis/shared";
import type { AuthContext, AuthScope } from "../../shared/security/auth-context.js";
import { EmergencyLockScope, EmergencyLockStatus } from "@jarvis/shared";

export interface SecurityAction {
  readonly action: string;
  readonly permission: PermissionKey;
  readonly module?: string;
  readonly resourceType?: string;
  readonly resourceId?: string;
  readonly agentId?: string;
  readonly risk?: AgentRiskLevel;
  readonly parametersHash?: string;
}

export interface SecurityDecision {
  readonly decision: ActionDecision;
  readonly code: string;
  readonly risk: AgentRiskLevel;
  readonly approvalRequired: boolean;
}

export interface LockSelector {
  readonly scope: EmergencyLockScope;
  readonly module?: string;
  readonly resourceType?: string;
  readonly resourceId?: string;
  readonly agentId?: string;
  readonly action?: string;
}

export interface EmergencyLock {
  readonly id: string;
  readonly selector: LockSelector;
  readonly status: EmergencyLockStatus;
  readonly reason: string;
  readonly version: number;
  readonly changedAt: string;
  readonly changedBy: string;
}

export interface LockService {
  activate(selector: LockSelector, reason: string, context: AuthContext): EmergencyLock;
  deactivate(lockId: string, context: AuthContext): EmergencyLock;
  inspect(): readonly EmergencyLock[];
  isBlocked(action: SecurityAction): boolean;
}

const roleCanControlLocks = (context: AuthContext): boolean =>
  context.actor.userId !== undefined && (context.role === UserRole.OWNER || context.role === UserRole.ADMIN);

const selectorMatches = (selector: LockSelector, action: SecurityAction): boolean => {
  if (selector.scope === EmergencyLockScope.GLOBAL) return true;
  if (selector.module && selector.module !== action.module) return false;
  if (selector.resourceType && selector.resourceType !== action.resourceType) return false;
  if (selector.resourceId && selector.resourceId !== action.resourceId) return false;
  if (selector.agentId && selector.agentId !== action.agentId) return false;
  if (selector.action && selector.action !== action.action) return false;
  return true;
};

export class InMemoryLockService implements LockService {
  private readonly locks = new Map<string, EmergencyLock>();
  private version = 0;

  activate(selector: LockSelector, reason: string, context: AuthContext): EmergencyLock {
    if (!roleCanControlLocks(context) || !reason.trim()) throw new Error("Lock activation denied");
    const lock: EmergencyLock = { id: crypto.randomUUID(), selector, status: EmergencyLockStatus.ACTIVE, reason, version: ++this.version, changedAt: new Date().toISOString(), changedBy: context.actor.userId! };
    this.locks.set(lock.id, lock);
    return lock;
  }

  deactivate(lockId: string, context: AuthContext): EmergencyLock {
    if (!roleCanControlLocks(context)) throw new Error("Lock deactivation denied");
    const current = this.locks.get(lockId);
    if (!current || current.status !== EmergencyLockStatus.ACTIVE) throw new Error("Lock state unavailable");
    const updated: EmergencyLock = { ...current, status: EmergencyLockStatus.INACTIVE, version: ++this.version, changedAt: new Date().toISOString(), changedBy: context.actor.userId! };
    this.locks.set(lockId, updated);
    return updated;
  }

  inspect(): readonly EmergencyLock[] { return [...this.locks.values()].sort((a, b) => a.version - b.version); }

  isBlocked(action: SecurityAction): boolean {
    return [...this.locks.values()].some((lock) => lock.status !== EmergencyLockStatus.ACTIVE ? false : selectorMatches(lock.selector, action));
  }
}

export const classifyRisk = (action: SecurityAction): AgentRiskLevel => {
  if (!action.action || !action.permission) return AgentRiskLevel.CRITICAL;
  if (["financial_action", "credential_read", "credential_write", "security_policy_change", "lock_control"].includes(action.permission)) return AgentRiskLevel.CRITICAL;
  if (["delete", "deploy", "publish", "send", "integration_connect", "integration_disconnect"].includes(action.permission)) return AgentRiskLevel.HIGH;
  if (action.risk === undefined) return AgentRiskLevel.CRITICAL;
  return action.risk;
};

export const approvalRequired = (risk: AgentRiskLevel, action: SecurityAction): boolean =>
  risk === AgentRiskLevel.HIGH || risk === AgentRiskLevel.CRITICAL || ["financial_action", "credential_read", "credential_write", "integration_connect", "integration_disconnect", "deploy", "delete", "security_policy_change", "lock_control"].includes(action.permission);

export const evaluateSecurityAction = (action: SecurityAction, context: AuthContext | undefined, lockService: LockService, approvalSatisfied = false): SecurityDecision => {
  const risk = classifyRisk(action);
  if (!context || !context.actor.userId && !context.actor.agentId && !context.actor.serviceId) return { decision: "BLOCKED" as ActionDecision, code: "IDENTITY_REQUIRED", risk, approvalRequired: false };
  if (lockService.isBlocked(action)) return { decision: "BLOCKED" as ActionDecision, code: "EMERGENCY_LOCK_ACTIVE", risk, approvalRequired: false };
  const required = approvalRequired(risk, action);
  if (required && !approvalSatisfied) return { decision: "APPROVAL_REQUIRED" as ActionDecision, code: "APPROVAL_REQUIRED", risk, approvalRequired: true };
  return { decision: "SAFE" as ActionDecision, code: "SECURITY_POLICY_ALLOW", risk, approvalRequired: required };
};

export type { AuthScope };
