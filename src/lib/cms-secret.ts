import { randomBytes } from "node:crypto";

export function resolvePayloadSecret(secret: string | undefined, production: boolean): string {
  const valid = secret && secret.length >= 32 &&
    !secret.startsWith("your-") && !secret.startsWith("temp-payload-");
  if (valid) return secret;
  if (production) throw new Error("Set PAYLOAD_SECRET to a private, randomly generated value of at least 32 characters before starting production.");
  return randomBytes(32).toString("hex");
}
