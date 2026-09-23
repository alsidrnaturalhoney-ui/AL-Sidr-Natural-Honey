import { createHash } from "node:crypto";

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => canonicalize(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, nested]) => [key, canonicalize(nested)]),
    );
  }

  return value;
}

export function stableHash(value: unknown): string {
  try {
    const normalized = JSON.stringify(canonicalize(value));
    return createHash("sha256").update(normalized).digest("hex");
  } catch (error) {
    throw new Error(
      `Unable to hash payload: ${error instanceof Error ? error.message : "unknown error"}`,
    );
  }
}
