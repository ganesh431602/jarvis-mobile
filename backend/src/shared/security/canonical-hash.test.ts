import { canonicalHash } from "../security/canonical-hash.js";

const a = { amount: 100, currency: "INR", resource: "invoice-1" };
const b = { resource: "invoice-1", currency: "INR", amount: 100 };

if (canonicalHash(a) !== canonicalHash(b)) {
  throw new Error("Canonical hashing must be stable across object key order.");
}

if (canonicalHash(a) === canonicalHash({ ...a, amount: 101 })) {
  throw new Error("Canonical hashing must change when parameters change.");
}

console.log("Security boundary tests passed.");
