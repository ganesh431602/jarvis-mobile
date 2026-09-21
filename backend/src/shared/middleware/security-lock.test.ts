import { assertNotLocked, lockApplies, type SecurityLock } from "./security-lock.js";

const lock: SecurityLock = {
  id: "lock-1",
  scope: "GLOBAL",
  reason: "Emergency stop",
  createdBy: "owner-1",
  createdAt: "2030-01-01T00:00:00.000Z",
  version: 1,
  active: true,
};

if (!lockApplies(lock, { action: "deploy" })) {
  throw new Error("Global lock must apply.");
}

try {
  assertNotLocked([lock], { action: "deploy" });
  throw new Error("Locked execution must be blocked.");
} catch (error) {
  if (!(error instanceof Error) || !error.message.includes("blocked")) {
    throw error;
  }
}

if (
  lockApplies(
    { ...lock, scope: "AGENT", targetId: "agent-1" },
    { agentId: "agent-2" },
  )
) {
  throw new Error("Agent lock must not affect another agent.");
}

if (
  !lockApplies(
    { ...lock, scope: "ACTION", targetId: "deploy" },
    { action: "deploy" },
  )
) {
  throw new Error("Action lock must apply.");
}

if (
  lockApplies(
    { ...lock, active: false },
    { action: "deploy" },
  )
) {
  throw new Error("Inactive lock must not apply.");
}
