import type { Request } from "express";
import type { ActorRef, ResourceScope } from "@jarvis/shared";

export interface AuthenticatedContext {
  readonly actor: ActorRef;
  readonly role?: string;
  readonly sessionId?: string;
  readonly requestId: string;
}

export type AuthenticatedRequest = Request & { readonly authContext?: AuthenticatedContext };

export const getAuthContext = (request: AuthenticatedRequest): AuthenticatedContext | undefined => request.authContext;
export type Authenticator = (request: Request) => Promise<AuthenticatedContext | undefined>;
export type AuthScope = ResourceScope;
