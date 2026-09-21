import type { AuthenticatedRole } from "./authentication.js";
import { roleHasPermission } from "./authorization.js";

const assert = (condition: boolean, message: string): void => {
  if (!condition) {
    throw new Error(message);
  }
};

const roles: AuthenticatedRole[] = [
  "Owner",
  "Admin",
  "Operator",
  "Viewer",
];

assert(roleHasPermission("Owner", "financial_action"), "Owner must have financial access.");
assert(roleHasPermission("Admin", "deploy"), "Admin must have deploy access.");
assert(roleHasPermission("Operator", "send"), "Operator must have send access.");
assert(!roleHasPermission("Operator", "financial_action"), "Operator must not have financial access.");
assert(roleHasPermission("Viewer", "read"), "Viewer must have read access.");
assert(!roleHasPermission("Viewer", "delete"), "Viewer must not have delete access.");
assert(!roleHasPermission("Viewer", "deploy"), "Viewer must not have deploy access.");
