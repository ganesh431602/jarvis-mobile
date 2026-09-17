import "dotenv/config";

export interface BackendConfig {
  readonly host: string;
  readonly port: number;
  readonly nodeEnv: string;
  readonly apiPrefix: "/api/v1";
  readonly supabaseUrl?: string;
  readonly supabaseAnonKey?: string;
  readonly supabaseServiceRoleKey?: string;
}

const parsePort = (value: string | undefined): number => {
  const port = Number(value ?? "3000");
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }
  return port;
};

export const config: BackendConfig = Object.freeze({
  host: process.env.HOST ?? "127.0.0.1",
  port: parsePort(process.env.PORT),
  nodeEnv: process.env.NODE_ENV ?? "development",
  apiPrefix: "/api/v1",
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
});
