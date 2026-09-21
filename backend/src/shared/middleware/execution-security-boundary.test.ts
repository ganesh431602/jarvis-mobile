import { createExecutionSecurityBoundary } from "./execution-security-boundary.js";
import type { SecurityLock } from "./security-lock.js";

const locks: SecurityLock[] = [
  {
    id: "lock-global",
    scope: "GLOBAL",
    reason: "Emergency stop",
    createdBy: "owner-1",
    createdAt: "2030-01-01T00:00:00.000Z",
    version: 1,
    active: true,
  },
];

const middleware = createExecutionSecurityBoundary({
  locks: () => locks,
  context: () => ({ action: "deploy" }),
});

if (typeof middleware !== "function") {
  throw new Error("Execution security boundary must return middleware.");
}

const nextCalls: number[] = [];
const response = {
  status: () => response,
  json: () => response,
} as never;

middleware(
  { headers: {} } as never,
  response,
  () => nextCalls.push(1),
);

if (nextCalls.length !== 0) {
  throw new Error("Locked execution must not reach next middleware.");
}
