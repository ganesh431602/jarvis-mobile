export interface RequestValidationResult { readonly valid: boolean; readonly errors: readonly string[]; }
export type RequestValidator<T> = (input: unknown) => RequestValidationResult & { readonly value?: T };
export const valid = <T>(value: T): RequestValidationResult & { value: T } => ({ valid: true, errors: [], value });
export const invalid = (...errors: string[]): RequestValidationResult => ({ valid: false, errors });
