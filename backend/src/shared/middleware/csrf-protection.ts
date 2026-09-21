import type { NextFunction, Request, Response } from "express";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export const csrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (SAFE_METHODS.has(req.method)) {
    next();
    return;
  }

  const cookie = req.headers.cookie;
  if (!cookie) {
    next();
    return;
  }

  const csrfHeader = req.headers["x-csrf-token"];

  if (
    typeof csrfHeader !== "string" ||
    csrfHeader.length < 32 ||
    csrfHeader.length > 256
  ) {
    res.status(403).json({ error: "CSRF validation failed." });
    return;
  }

  next();
};

export const securityCookieOptions = Object.freeze({
  httpOnly: true,
  secure: true,
  sameSite: "strict" as const,
  path: "/",
});
