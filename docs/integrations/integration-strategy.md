# Integration strategy

Integrations will be provider adapters behind backend interfaces. Phase 1 records only non-secret metadata and connection status such as provider identity and `NOT_CONNECTED`; it performs no OAuth, API calls, or credential storage.

Future integrations must declare capabilities, scopes, risk, and required approvals. Tokens and keys belong in approved secret management, never in frontend code, logs, Git, or ordinary JSONB.
