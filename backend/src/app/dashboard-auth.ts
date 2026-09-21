import { createSupabaseAuthVerifier } from "../shared/auth/supabase-auth-verifier.js";
import { createBearerAuthentication } from "../shared/middleware/bearer-authentication.js";
import type { RequestHandler } from "express";
import { config } from "./config.js";

export const createDashboardAuthentication = (): RequestHandler => {
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    if (config.nodeEnv === "production") {
      throw new Error("Supabase authentication is required in production.");
    }

    return (_request, response, _next) => {
      response.status(503).json({
        error: "Authentication service is not configured.",
      });
    };
  }

  const verifier = createSupabaseAuthVerifier(
    config.supabaseUrl,
    config.supabaseAnonKey,
  );

  return createBearerAuthentication(verifier);
};

