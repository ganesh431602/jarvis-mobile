import type { AuthenticatedIdentity } from "../middleware/authentication.js";
import { scopeAllows, type ResourceScope } from "../middleware/resource-scope.js";

export const authorizeResource = (
  identity: AuthenticatedIdentity,
  scope: ResourceScope,
  resourceType: string,
  resourceId?: string,
): void => {
  if (!identity.userId) {
    throw new Error("Authorization denied.");
  }

  if (!scopeAllows(scope, resourceType, resourceId)) {
    throw new Error("Authorization denied: resource scope violation.");
  }
};
