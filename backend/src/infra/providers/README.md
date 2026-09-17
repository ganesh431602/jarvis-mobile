# Provider boundary

Provider interfaces isolate future AI and external-provider implementations. Providers must be injected into services and must not expose credentials, tokens, or SDK-specific types through domain contracts.
