import { randomUUID } from "node:crypto";
import {
  ActionDecision,
  AgentRiskLevel,
  EmergencyLockScope,
  EmergencyLockStatus,
  PermissionKey,
  UserRole,
} from "@jarvis/shared";
import type { AgentRiskCeiling, ResourceScope } from "@jarvis/shared";
import type { AuthContext } from "../../shared/security/auth-context.js";

export interface SecurityAction {
  readonly action: string;
  readonly permission: PermissionKey;
  readonly module?: string;
  readonly resourceType?: string;
  readonly resourceId?: string;
  readonly resourceScope?: ResourceScope;
  readonly agentId?: string;
  readonly risk?: AgentRiskLevel;
  readonly parametersHash?: string;
  readonly approval?: ApprovalEvidence;
}

export interface ApprovalEvidence {
  readonly id: string;
  readonly action: string;
  readonly resourceType?: string;
  readonly resourceId?: string;
  readonly scope?: ResourceScope;
  readonly risk: AgentRiskLevel;
  readonly policyVersion: string;
  readonly parameterHash: string;
  readonly expiresAt: string;
  readonly reviewerId: string;
  readonly approved: boolean;
  readonly used: boolean;
}

export interface SecurityIdentity extends AuthContext {
  readonly role?: UserRole;
  readonly permissions?: readonly PermissionKey[];
  readonly scope?: ResourceScope;
  readonly agentRiskCeiling?: AgentRiskCeiling;
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
  activate(selector: LockSelector, reason: string, context: SecurityIdentity): EmergencyLock;
  deactivate(lockId: string, context: SecurityIdentity): EmergencyLock;
  inspect(): readonly EmergencyLock[];
  isBlocked(action: SecurityAction): boolean;
}

const roleCanControlLocks = (context: SecurityIdentity): boolean =>
  context.actor.userId !== undefined &&
  context.actor.agentId === undefined &&
  context.actor.serviceId === undefined &&
  (context.role === UserRole.OWNER || context.role === UserRole.ADMIN);

const validSelector = (selector: LockSelector): boolean => {
  if (!Object.values(EmergencyLockScope).includes(selector.scope)) return false;
  if (selector.scope === EmergencyLockScope.GLOBAL) return true;
  return Boolean(selector.module || selector.resourceType || selector.resourceId || selector.agentId || selector.action);
};

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

  activate(selector: LockSelector, reason: string, context: SecurityIdentity): EmergencyLock {
    if (!roleCanControlLocks(context) || !validSelector(selector) || !reason.trim()) throw new Error("Lock activation denied");
    const lock: EmergencyLock = { id: randomUUID(), selector, status: EmergencyLockStatus.ACTIVE, reason, version: ++this.version, changedAt: new Date().toISOString(), changedBy: context.actor.userId as string };
    this.locks.set(lock.id, lock);
    return lock;
  }

  deactivate(lockId: string, context: SecurityIdentity): EmergencyLock {
    if (!roleCanControlLocks(context)) throw new Error("Lock deactivation denied");
    const current = this.locks.get(lockId);
    if (!current || current.status !== EmergencyLockStatus.ACTIVE) throw new Error("Lock state unavailable");
    const updated: EmergencyLock = { ...current, status: EmergencyLockStatus.INACTIVE, version: ++this.version, changedAt: new Date().toISOString(), changedBy: context.actor.userId as string };
    this.locks.set(lockId, updated);
    return updated;
  }

  inspect(): readonly EmergencyLock[] { return [...this.locks.values()].sort((a, b) => a.version - b.version); }

  isBlocked(action: SecurityAction): boolean {
    if (!action.action || !action.permission) return true;
    try {
      return [...this.locks.values()].some((lock) => {
        if (!Object.values(EmergencyLockStatus).includes(lock.status)) return true;
        return lock.status === EmergencyLockStatus.ACTIVE && selectorMatches(lock.selector, action);
      });
    } catch {
      return true;
    }
  }
}

const riskRank: Record<AgentRiskLevel, number> = { LOW: 0, MEDIUM: 1, HIGH: 2, CRITICAL: 3 };
const knownRisk = (value: unknown): value is AgentRiskLevel => Object.values(AgentRiskLevel).includes(value as AgentRiskLevel);

export const classifyRisk = (action: SecurityAction): AgentRiskLevel => {
  if (!action.action || !Object.values(PermissionKey).includes(action.permission)) return AgentRiskLevel.CRITICAL;
  if ([PermissionKey.FINANCIAL_ACTION, PermissionKey.CREDENTIAL_READ, PermissionKey.CREDENTIAL_WRITE, PermissionKey.SECURITY_POLICY_CHANGE, PermissionKey.LOCK_CONTROL].includes(action.permission)) return AgentRiskLevel.CRITICAL;
  if ([PermissionKey.DELETE, PermissionKey.DEPLOY, PermissionKey.PUBLISH, PermissionKey.SEND, PermissionKey.INTEGRATION_CONNECT, PermissionKey.INTEGRATION_DISCONNECT].includes(action.permission)) return AgentRiskLevel.HIGH;
  return knownRisk(action.risk) ? action.risk : AgentRiskLevel.CRITICAL;
};

export const approvalRequired = (risk: AgentRiskLevel): boolean => risk === AgentRiskLevel.HIGH || risk === AgentRiskLevel.CRITICAL;

const sameScope = (left: ResourceScope | undefined, right: ResourceScope | undefined): boolean => JSON.stringify(left ?? {}) === JSON.stringify(right ?? {});
const validIdentity = (context: SecurityIdentity | undefined): context is SecurityIdentity => Boolean(context && (context.actor.userId || context.actor.agentId || context.actor.serviceId) && context.role && Object.values(UserRole).includes(context.role));

export const evaluateSecurityAction = (action: SecurityAction, context: SecurityIdentity | undefined, lockService: LockService, policyVersion: string, approvalSatisfied = false): SecurityDecision => {
  const risk = classifyRisk(action);
  if (!validIdentity(context)) return { decision: ActionDecision.BLOCKED, code: "IDENTITY_REQUIRED", risk, approvalRequired: false };
  if (!context.permissions?.includes(action.permission)) return { decision: ActionDecision.BLOCKED, code: "PERMISSION_DENIED", risk, approvalRequired: false };
  if (context.actor.agentId && (context.role === UserRole.OWNER || context.role === UserRole.ADMIN)) return { decision: ActionDecision.BLOCKED, code: "AGENT_ROLE_FORBIDDEN", risk, approvalRequired: false };
  if (context.actor.agentId && (!context.agentRiskCeiling || riskRank[risk] > riskRank[context.agentRiskCeiling.maximumRisk])) return { decision: ActionDecision.BLOCKED, code: "AGENT_RISK_CEILING", risk, approvalRequired: false };
  if (context.scope && action.resourceScope && !sameScope(context.scope, action.resourceScope)) return { decision: ActionDecision.BLOCKED, code: "RESOURCE_SCOPE_DENIED", risk, approvalRequired: false };
  try { if (lockService.isBlocked(action)) return { decision: ActionDecision.BLOCKED, code: "EMERGENCY_LOCK_ACTIVE", risk, approvalRequired: false }; } catch { return { decision: ActionDecision.BLOCKED, code: "LOCK_STATE_UNAVAILABLE", risk, approvalRequired: false }; }
  if (!policyVersion.trim()) return { decision: ActionDecision.BLOCKED, code: "POLICY_UNAVAILABLE", risk, approvalRequired: false };
  const required = approvalRequired(risk);
  if (required && !approvalSatisfied) return { decision: ActionDecision.APPROVAL_REQUIRED, code: "APPROVAL_REQUIRED", risk, approvalRequired: true };
  return { decision: ActionDecision.SAFE, code: "SECURITY_POLICY_ALLOW", risk, approvalRequired: required };
};
