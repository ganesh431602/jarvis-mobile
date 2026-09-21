import express from "express";
import { createSecurityLockMiddleware } from "./security-lock-middleware.js";
import type { SecurityLock } from "./security-lock.js";

const app = express();

const locks: SecurityLock[] = [
  {
    id: "lock-1",
    scope: "GLOBAL",
    reason: "Emergency stop",
    createdBy: "owner-1",
    createdAt: "2030-01-01T00:00:00.000Z",
    version: 1,
    active: true,
  },
];

app.post(
  "/execute",
  createSecurityLockMiddleware(
    () => locks,
    () => ({ action: "deploy" }),
  ),
  (_req, res) => res.status(200).json({ executed: true }),
);

const server = app.listen(0);

try {
  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Unable to determine test server address.");
  }

  const response = await fetch(`http://127.0.0.1:${address.port}/execute`);

  if (response.status !== 423) {
    throw new Error(`Expected 423, received ${response.status}.`);
  }
} finally {
  server.close();
}
