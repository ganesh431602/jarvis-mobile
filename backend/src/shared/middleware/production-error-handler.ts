import type { NextFunction, Request, Response } from "express";

export const productionErrorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const requestId = res.getHeader("X-Request-Id");

  res.status(500).json({
    error: "Internal server error.",
    requestId: typeof requestId === "string" ? requestId : undefined,
  });
};
