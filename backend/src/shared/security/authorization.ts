import type { ActionDecision, PermissionKey } from "@jarvis/shared";
import type { AuthenticatedContext, AuthScope } from "./auth-context.js";

export interface AuthorizationRequest {
  readonly context?: AuthenticatedContext;
  readonly permission: PermissionKey;
  readonly scope?: AuthScope;
  readonly risk?: string;
}

export interface AuthorizationService {
  authorize(request: AuthorizationRequest): Promise<ActionDecision>;
}

export const denyByDefaultAuthorization: AuthorizationService = {
  async authorize(): Promise<ActionDecision> { return "BLOCKED" as ActionDecision; },
};
