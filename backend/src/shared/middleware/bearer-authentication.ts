import { type NextFunction, type Response } from "express";
import type { AuthenticatedRequest } from "./authentication.js";
import type { AuthVerifier } from "../auth/supabase-auth-verifier.js";

export const createBearerAuthentication = (verifier: AuthVerifier) =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }

    const token = authorization.slice("Bearer ".length).trim();

    if (!token) {
      res.status(401).json({ error: "Authentication required." });
      return;
    }

    try {
      req.auth = await verifier.verifyAccessToken(token);
      next();
    } catch {
      res.status(401).json({ error: "Invalid authentication token." });
    }
  };
