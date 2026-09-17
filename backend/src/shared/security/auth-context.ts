import type { Request } from "express";
import type { ActorRef, ResourceScope } from "@jarvis/shared";

/** Canonical authenticated identity context; authentication is not implemented here. */
export interface AuthContext {
  readonly actor: ActorRef;
  readonly role?: string;
  readonly sessionId?: string;
  readonly requestId: string;
}

export type AuthenticatedRequest = Request & { readonly authContext?: AuthContext };

export const getAuthContext = (request: AuthenticatedRequest): AuthContext | undefined => request.authContext;
export type Authenticator = (request: Request) => Promise<AuthContext | undefined>;
export type AuthScope = ResourceScope;
