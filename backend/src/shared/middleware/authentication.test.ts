import { type NextFunction, type Request, type Response } from "express";
import {
  requireAuthentication,
  type AuthenticatedRequest,
} from "./authentication.js";

describeAuthentication();

function describeAuthentication(): void {
  const next = (() => undefined) as NextFunction;

  const createResponse = () => {
    let statusCode = 200;
    let body: unknown;

    const response = {
      status(code: number) {
        statusCode = code;
        return response;
      },
      json(value: unknown) {
        body = value;
        return response;
      },
    } as unknown as Response;

    return {
      response,
      get statusCode() {
        return statusCode;
      },
      get body() {
        return body;
      },
    };
  };

  const createRequest = (
    headers: Record<string, string | undefined>,
  ): AuthenticatedRequest =>
    ({
      headers,
    }) as AuthenticatedRequest;

  const valid = createResponse();
  requireAuthentication(
    createRequest({
      "x-auth-user-id": "user-1",
      "x-auth-session-id": "session-1",
      "x-auth-role": "Owner",
    }),
    valid.response,
    next,
  );

  if (valid.statusCode !== 200) {
    throw new Error("Valid authentication context was rejected.");
  }

  const missing = createResponse();
  requireAuthentication(
    createRequest({
      "x-auth-session-id": "session-1",
      "x-auth-role": "Owner",
    }),
    missing.response,
    next,
  );

  if (missing.statusCode !== 401) {
    throw new Error("Missing authentication was not rejected.");
  }

  const invalidRole = createResponse();
  requireAuthentication(
    createRequest({
      "x-auth-user-id": "user-1",
      "x-auth-session-id": "session-1",
      "x-auth-role": "SuperUser",
    }),
    invalidRole.response,
    next,
  );

  if (invalidRole.statusCode !== 401) {
    throw new Error("Invalid role was not rejected.");
  }
}
