import { stableHash } from "./hash.js";

export type DriftState = "GREEN" | "AMBER" | "RED";

export type DriftResult = Readonly<{
  state: DriftState;
  sourceHash: string;
  projectionHash: string;
  reason: string;
}>;

export function detectProjectionDrift(
  source: unknown,
  projection: unknown,
  options: { projectionVerified?: boolean; projectionFresh?: boolean } = {},
): DriftResult {
  const sourceHash = stableHash(source);
  const projectionHash = stableHash(projection);

  if (sourceHash !== projectionHash) {
    return {
      state: "RED",
      sourceHash,
      projectionHash,
      reason: "authoritative_conflict",
    };
  }
  if (options.projectionVerified === false || options.projectionFresh === false) {
    return {
      state: "AMBER",
      sourceHash,
      projectionHash,
      reason: "projection_requires_verification",
    };
  }
  return {
    state: "GREEN",
    sourceHash,
    projectionHash,
    reason: "synchronized_and_verified",
  };
}
