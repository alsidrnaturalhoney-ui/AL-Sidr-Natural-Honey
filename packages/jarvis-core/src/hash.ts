import { createHash } from "node:crypto";

export function stableHash(value: unknown): string {
  try {
    const normalized = JSON.stringify(value, Object.keys((value ?? {}) as object).sort());
    return createHash("sha256").update(normalized).digest("hex");
  } catch (error) {
    throw new Error(`Unable to hash payload: ${error instanceof Error ? error.message : "unknown error"}`);
  }
}
