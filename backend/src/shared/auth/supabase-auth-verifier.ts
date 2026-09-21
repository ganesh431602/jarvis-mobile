import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AuthenticatedIdentity, AuthenticatedRole } from "../middleware/authentication.js";

export interface AuthVerifier {
  verifyAccessToken(token: string): Promise<AuthenticatedIdentity>;
}

const mapRole = (value: unknown): AuthenticatedRole =>
  value === "Owner" || value === "Admin" || value === "Operator" || value === "Viewer"
    ? value
    : "Viewer";

export class SupabaseAuthVerifier implements AuthVerifier {
  constructor(private readonly client: SupabaseClient) {}

  async verifyAccessToken(token: string): Promise<AuthenticatedIdentity> {
    const { data, error } = await this.client.auth.getClaims(token);

    if (error || !data?.claims?.sub) {
      throw new Error("Invalid access token");
    }

    const claims = data.claims as Record<string, unknown>;

    return Object.freeze({
      userId: String(claims.sub),
      sessionId: typeof claims.session_id === "string" ? claims.session_id : "supabase-jwt",
      role: mapRole(claims.user_role),
    });
  }
}

export const createSupabaseAuthVerifier = (
  supabaseUrl: string,
  supabaseAnonKey: string,
): AuthVerifier => {
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  return new SupabaseAuthVerifier(client);
};
