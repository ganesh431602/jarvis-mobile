# Infrastructure boundary

Infrastructure isolates external systems from domain modules. Domain services depend on repository/provider interfaces and receive implementations through explicit construction; they must not import SDKs directly.

Supabase configuration is optional during startup. Operations that require an unconfigured provider must fail with a controlled configuration error. No adapter in this batch connects to Supabase.
