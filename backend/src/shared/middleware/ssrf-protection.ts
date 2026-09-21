import type { NextFunction, Request, Response } from "express";
import { URL } from "node:url";

const PRIVATE_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "169.254.169.254",
  "metadata.google.internal",
]);

const PRIVATE_IP = /^(10\.)|(127\.)|(169\.254\.)|(192\.168\.)|(172\.(1[6-9]|2[0-9]|3[0-1])\.)$/;

export const assertSafeOutboundUrl = (value: string): URL => {
  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error("Invalid outbound URL.");
  }

  if (!["https:"].includes(parsed.protocol)) {
    throw new Error("Only HTTPS outbound requests are permitted.");
  }

  const hostname = parsed.hostname.toLowerCase();

  if (
    PRIVATE_HOSTS.has(hostname) ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".internal") ||
    PRIVATE_IP.test(hostname)
  ) {
    throw new Error("Outbound request to private/internal network is blocked.");
  }

  if (hostname.includes("%")) {
    throw new Error("Invalid outbound hostname.");
  }

  return parsed;
};

export const ssrfProtection = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const candidate =
    typeof req.query.url === "string"
      ? req.query.url
      : typeof req.body?.url === "string"
        ? req.body.url
        : undefined;

  if (!candidate) {
    next();
    return;
  }

  try {
    assertSafeOutboundUrl(candidate);
    next();
  } catch {
    res.status(400).json({ error: "Unsafe outbound URL." });
  }
};
