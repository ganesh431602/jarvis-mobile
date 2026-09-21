import type { NextFunction, Response } from "express";
import type { AuthenticatedRequest } from "./authentication.js";

export const requireBearerAuthentication = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authorization = req.headers.authorization;

  if (!authorization || !/^Bearer\s+\S+$/.test(authorization)) {
    res.status(401).json({
      error: "Authentication required.",
    });
    return;
  }

  next();
};
