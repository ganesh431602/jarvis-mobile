import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./authentication.js";
import { createSecurityLockMiddleware } from "./security-lock-middleware.js";
import type { LockContext, SecurityLock } from "./security-lock.js";

export interface ExecutionSecurityBoundary {
  readonly locks: () => readonly SecurityLock[];
  readonly context: (req: AuthenticatedRequest) => LockContext;
}

export const createExecutionSecurityBoundary = (
  boundary: ExecutionSecurityBoundary,
) =>
  createSecurityLockMiddleware(
    boundary.locks,
    boundary.context,
  );

export const requireExecutionSecurity = (
  boundary: ExecutionSecurityBoundary,
) =>
  (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    createExecutionSecurityBoundary(boundary)(req, res, next);
  };
