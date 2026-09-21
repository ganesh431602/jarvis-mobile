import { scopeAllows, type ResourceScope } from "./resource-scope.js";

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message);
  }
};

const allClients: ResourceScope = {
  resourceType: "client",
};

const selectedClients: ResourceScope = {
  resourceType: "client",
  resourceIds: ["client-1", "client-2"],
};

assert(scopeAllows(allClients, "client", "client-99"), "Unrestricted scope should allow matching resources.");
assert(!scopeAllows(allClients, "project", "project-1"), "Resource types must match.");
assert(scopeAllows(selectedClients, "client", "client-1"), "Selected resource should be allowed.");
assert(!scopeAllows(selectedClients, "client", "client-99"), "Unselected resource must be denied.");
assert(!scopeAllows(selectedClients, "client"), "Resource-specific scope requires a resource id.");
