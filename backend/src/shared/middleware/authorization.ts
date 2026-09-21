import { type NextFunction, type Response } from "express";
import type { AuthenticatedRequest, AuthenticatedRole } from "./authentication.js";

export type Permission =
  | "read"
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "send"
  | "deploy"
  | "financial_action";

const rolePermissions: Record<AuthenticatedRole, readonly Permission[]> = {
  Owner: [
    "read",
    "create",
    "update",
    "delete",
    "publish",
    "send",
    "deploy",
    "financial_action",
  ],
  Admin: [
    "read",
    "create",
    "update",
    "delete",
    "publish",
    "send",
    "deploy",
  ],
  Operator: [
    "read",
    "create",
    "update",
    "publish",
    "send",
  ],
  Viewer: ["read"],
};

export const roleHasPermission = (
  role: AuthenticatedRole,
  permission: Permission,
): boolean => rolePermissions[role].includes(permission);

export const requirePermission = (permission: Permission) =>
  (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.auth) {
      res.status(401).json({
        error: "Authentication required.",
      });
      return;
    }

    if (!roleHasPermission(req.auth.role, permission)) {
      res.status(403).json({
        error: "Insufficient permission.",
      });
      return;
    }

    next();
  };
