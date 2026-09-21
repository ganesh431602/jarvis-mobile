import { assertSafeOutboundUrl } from "../middleware/ssrf-protection.js";
import { canonicalHash } from "../security/canonical-hash.js";

const assertThrows = (fn: () => unknown, message: string): void => {
  try {
    fn();
    throw new Error(message);
  } catch (error) {
    if (error instanceof Error && error.message === message) {
      throw error;
    }
  }
};

assertThrows(
  () => assertSafeOutboundUrl("http://127.0.0.1:3000"),
  "SSRF private IPv4 address was allowed.",
);

assertThrows(
  () => assertSafeOutboundUrl("https://localhost/admin"),
  "SSRF localhost was allowed.",
);

assertThrows(
  () => assertSafeOutboundUrl("ftp://example.com/file"),
  "Non-HTTPS outbound URL was allowed.",
);

const first = canonicalHash({
  action: "deploy",
  resource: { id: "project-1", type: "project" },
  parameters: { branch: "main", force: false },
});

const second = canonicalHash({
  parameters: { force: false, branch: "main" },
  resource: { type: "project", id: "project-1" },
  action: "deploy",
});

if (first !== second) {
  throw new Error("Canonical hashing is not deterministic.");
}

console.log("Security regression checks passed.");
