const SENSITIVE_NAME = /password|secret|token|api[_-]?key|authorization|cookie|otp|pin|private[_-]?key/i;

export const assertSafeSecretName = (name: string): void => {
  if (!name || SENSITIVE_NAME.test(name)) {
    throw new Error("Invalid or sensitive secret reference.");
  }
};

export const assertSecretNotExposed = (value: unknown): void => {
  if (typeof value !== "string") return;

  if (
    /-----BEGIN .*PRIVATE KEY-----/.test(value) ||
    /Bearer\s+[A-Za-z0-9._-]+/i.test(value)
  ) {
    throw new Error("Secret material must not be exposed.");
  }
};
