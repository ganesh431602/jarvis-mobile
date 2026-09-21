import { assertSafeSecretName, assertSecretNotExposed } from "./secret-safety.js";
import { validateFileUpload } from "./file-upload-security.js";

assertSafeSecretName("githubCredential");
assertSafeSecretName("databaseConnection");
validateFileUpload("application/pdf", 1024);

try {
  assertSafeSecretName("api_key");
  throw new Error("Sensitive secret names must be rejected.");
} catch (error) {
  if (!(error instanceof Error) || !error.message.includes("sensitive")) {
    throw error;
  }
}

try {
  assertSecretNotExposed("-----BEGIN PRIVATE KEY-----");
  throw new Error("Private key material must be rejected.");
} catch (error) {
  if (!(error instanceof Error) || !error.message.includes("exposed")) {
    throw error;
  }
}

try {
  validateFileUpload("application/x-executable", 1024);
  throw new Error("Unsupported upload type must be rejected.");
} catch (error) {
  if (!(error instanceof Error) || !error.message.includes("Unsupported")) {
    throw error;
  }
}

try {
  validateFileUpload("application/pdf", 11 * 1024 * 1024);
  throw new Error("Oversized upload must be rejected.");
} catch (error) {
  if (!(error instanceof Error) || !error.message.includes("size")) {
    throw error;
  }
}
