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

export const notFoundHandler = (_request: Request, _response: Response, next: NextFunction): void => {
  next(new ApplicationError("NOT_FOUND", "The requested resource was not found", 404));
};

export const errorHandler = (error: unknown, request: Request, response: Response, _next: NextFunction): void => {
  const known = error instanceof ApplicationError;
  const body: ApiResponse<never> = {
    success: false,
    error: {
      code: known ? error.code : "INTERNAL_ERROR",
      message: known ? error.publicMessage : "An internal error occurred",
      details: { requestId: request.requestId, correlationId: request.correlationId },
    },
  };
  response.status(known ? error.statusCode : 500).json(body);
};
