import { type NextFunction, type Response } from "express";
import type { AuthenticatedRequest } from "./authentication.js";
import { assertNotLocked, type LockContext, type SecurityLock } from "./security-lock.js";

export const createSecurityLockMiddleware = (
  getLocks: () => readonly SecurityLock[],
  getContext: (req: AuthenticatedRequest) => LockContext,
) =>
  (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      assertNotLocked(getLocks(), getContext(req));
      next();
    } catch {
      res.status(423).json({
        error: "Execution blocked by active security lock.",
      });
    }
  };
