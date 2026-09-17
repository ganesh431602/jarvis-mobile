import type { BackendConfig } from "../../app/config.js";

export class ProviderConfigurationError extends Error {
  constructor(provider: string) {
    super(`${provider} is not configured`);
    this.name = "ProviderConfigurationError";
  }
}

export interface SupabaseAdapter {
  readonly configured: boolean;
  assertConfigured(): void;
}

/**
 * Phase 1 boundary only. The Supabase SDK is intentionally not imported here
 * until a reviewed repository implementation requires it.
 */
export const createSupabaseAdapter = (configuration: BackendConfig): SupabaseAdapter => {
  const configured = Boolean(
    configuration.supabaseUrl &&
    configuration.supabaseAnonKey,
  );

  return Object.freeze({
    configured,
    assertConfigured(): void {
      if (!configured) {
        throw new ProviderConfigurationError("Supabase");
      }
    },
  });
};
