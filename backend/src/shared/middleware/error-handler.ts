import type { NextFunction, Request, Response } from "express";
import type { ApiResponse } from "@jarvis/shared";

export class ApplicationError extends Error {
  constructor(readonly code: string, readonly publicMessage: string, readonly statusCode = 500, options?: { cause?: unknown }) {
    super(publicMessage, options);
    this.name = "ApplicationError";
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string) { super("VALIDATION_ERROR", message, 400); }
}

export class AuthorizationError extends ApplicationError {
  constructor() { super("FORBIDDEN", "The requested operation is not permitted", 403); }
}

export const notFoundHandler = (request: Request, _response: Response, next: NextFunction): void => {
  next(new ApplicationError("NOT_FOUND", `No route for ${request.method} ${request.path}`, 404));
};

export const errorHandler = (error: unknown, request: Request, response: Response, _next: NextFunction): void => {
  const known = error instanceof ApplicationError;
  const statusCode = known ? error.statusCode : 500;
  const body: ApiResponse<never> = {
    success: false,
    error: {
      code: known ? error.code : "INTERNAL_ERROR",
      message: known ? error.publicMessage : "An internal error occurred",
      details: request.requestId ? { requestId: request.requestId } : undefined,
    },
  };
  response.status(statusCode).json(body);
};
