export type LockScope = "GLOBAL" | "MODULE" | "AGENT" | "RESOURCE" | "ACTION";

export interface SecurityLock {
  readonly id: string;
  readonly scope: LockScope;
  readonly targetId?: string;
  readonly reason: string;
  readonly createdBy: string;
  readonly createdAt: string;
  readonly version: number;
  readonly active: boolean;
}

export interface LockContext {
  readonly module?: string;
  readonly agentId?: string;
  readonly resourceType?: string;
  readonly resourceId?: string;
  readonly action?: string;
}

export const lockApplies = (
  lock: SecurityLock,
  context: LockContext,
): boolean => {
  if (!lock.active) return false;

  switch (lock.scope) {
    case "GLOBAL":
      return true;
    case "MODULE":
      return lock.targetId === context.module;
    case "AGENT":
      return lock.targetId === context.agentId;
    case "RESOURCE":
      return lock.targetId === context.resourceId;
    case "ACTION":
      return lock.targetId === context.action;
    default:
      return true;
  }
};

export const assertNotLocked = (
  locks: readonly SecurityLock[],
  context: LockContext,
): void => {
  if (locks.some((lock) => lockApplies(lock, context))) {
    throw new Error("Execution blocked by active security lock.");
  }
};
