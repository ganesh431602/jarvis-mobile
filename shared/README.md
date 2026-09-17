# Shared contract boundary

Shared contracts are framework-neutral and independent of React, Express, Supabase, PostgreSQL SDKs, AI providers, and Android. Enums use JSON-safe string values. Boundary timestamps are ISO/UTC strings and identifiers are strings.

`contracts/` contains resource and API shapes; `enums/` contains stable serialized values; `types/` contains neutral security and metadata primitives; `validation/` contains lightweight boundary validation types and helpers. Validation does not authorize actions.

Audit metadata and integration configuration are non-secret metadata only. Secrets, tokens, passwords, and credential values must never be represented by these contracts.
