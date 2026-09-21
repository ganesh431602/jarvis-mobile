import { type NextFunction, type Request, type Response } from "express";

export type AuthenticatedRole = "Owner" | "Admin" | "Operator" | "Viewer";

export interface AuthenticatedIdentity {
  readonly userId: string;
  readonly role: AuthenticatedRole;
  readonly sessionId: string;
}

export interface AuthenticatedRequest extends Request {
  auth?: AuthenticatedIdentity;
}

export const requireAuthentication = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const userId = req.headers["x-auth-user-id"];
  const sessionId = req.headers["x-auth-session-id"];
  const role = req.headers["x-auth-role"];

  if (
    typeof userId !== "string" ||
    userId.trim() === "" ||
    typeof sessionId !== "string" ||
    sessionId.trim() === "" ||
    !isAuthenticatedRole(role)
  ) {
    res.status(401).json({
      error: "Authentication required.",
    });
    return;
  }

  req.auth = Object.freeze({
    userId,
    sessionId,
    role,
  });

  next();
};

const isAuthenticatedRole = (
  value: unknown,
): value is AuthenticatedRole =>
  value === "Owner" ||
  value === "Admin" ||
  value === "Operator" ||
  value === "Viewer";
