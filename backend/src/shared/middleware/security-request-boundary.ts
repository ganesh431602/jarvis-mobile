import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { config } from "../../app/config.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export const securityRequestBoundary = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const requestIdHeader = req.headers["x-request-id"];
  const requestId =
    typeof requestIdHeader === "string" &&
    /^[A-Za-z0-9._:-]{1,128}$/.test(requestIdHeader)
      ? requestIdHeader
      : randomUUID();

  res.setHeader("X-Request-Id", requestId);
  res.setHeader("Cache-Control", SAFE_METHODS.has(req.method) ? "no-store" : "no-store");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");

  if (
    config.nodeEnv === "production" &&
    (req.headers["x-auth-user-id"] ||
      req.headers["x-auth-session-id"] ||
      req.headers["x-auth-role"])
  ) {
    res.status(400).json({
      error: "Legacy authentication headers are not accepted.",
      requestId,
    });
    return;
  }

  next();
};
