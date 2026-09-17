import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import type { AuthContext } from "../security/auth-context.js";

const requestIdPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;

export const requestContext = (request: Request, response: Response, next: NextFunction): void => {
  const supplied = request.header("x-request-id");
  const requestId = supplied && requestIdPattern.test(supplied) ? supplied : randomUUID();
  request.requestId = requestId;
  response.setHeader("x-request-id", requestId);
  next();
};

declare global {
  namespace Express {
    interface Request {
      requestId: string;
      authContext?: AuthContext;
    }
  }
}
