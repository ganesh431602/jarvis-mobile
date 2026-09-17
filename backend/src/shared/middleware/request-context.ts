import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import type { AuthContext } from "../security/auth-context.js";

const requestIdPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

export interface RequestContext {
  readonly requestId: string;
  readonly correlationId: string;
}

export const requestContext = (request: Request, response: Response, next: NextFunction): void => {
  const suppliedRequestId = request.header("x-request-id");
  const requestId = suppliedRequestId && requestIdPattern.test(suppliedRequestId) ? suppliedRequestId : randomUUID();
  const suppliedCorrelationId = request.header("x-correlation-id");
  const correlationId = suppliedCorrelationId && requestIdPattern.test(suppliedCorrelationId) ? suppliedCorrelationId : requestId;

  request.requestId = requestId;
  request.correlationId = correlationId;
  response.setHeader("x-request-id", requestId);
  response.setHeader("x-correlation-id", correlationId);
  next();
};

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      correlationId: string;
      authContext?: AuthContext;
    }
  }
}
