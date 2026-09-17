import type { NextFunction, Request, RequestHandler, Response } from "express";

export interface RequestValidationResult<T = unknown> {
  readonly valid: boolean;
  readonly errors: readonly string[];
  readonly value?: T;
}

export type RequestValidator<T> = (input: unknown) => RequestValidationResult<T>;

export const valid = <T>(value: T): RequestValidationResult<T> => ({ valid: true, errors: [], value });
export const invalid = <T = never>(...errors: string[]): RequestValidationResult<T> => ({ valid: false, errors });

export const validateRequest = <T>(validator: RequestValidator<T>, source: "body" | "query" | "params" = "body"): RequestHandler => {
  return (request: Request, _response: Response, next: NextFunction): void => {
    const result = validator(request[source]);
    if (!result.valid) {
      next(new Error(`Request validation failed: ${result.errors.join(", ")}`));
      return;
    }
    next();
  };
};
