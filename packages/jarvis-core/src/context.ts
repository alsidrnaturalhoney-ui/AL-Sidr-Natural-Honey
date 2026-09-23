import { z } from "zod";

export const GroundingRecord = z.object({
  id: z.string().min(1),
  authorityDomain: z.string().min(1),
  sourceSystem: z.string().min(1),
  sourceRef: z.string().min(1),
  capturedAt: z.string().datetime(),
  freshnessAt: z.string().datetime().nullable(),
  confidence: z.number().min(0).max(1),
  payload: z.record(z.unknown()),
});

export type GroundingRecord = z.infer<typeof GroundingRecord>;

export const GroundedContext = z.object({
  records: z.array(GroundingRecord),
  staleRecordIds: z.array(z.string()),
  lowConfidenceRecordIds: z.array(z.string()),
});

export type GroundedContext = z.infer<typeof GroundedContext>;

export function hydrateContext(
  inputs: unknown[],
  options: { now?: Date; minimumConfidence?: number } = {},
): GroundedContext {
  const records = inputs.map((input) => GroundingRecord.parse(input));
  const now = options.now ?? new Date();
  const minimumConfidence = options.minimumConfidence ?? 0.8;

  return GroundedContext.parse({
    records,
    staleRecordIds: records
      .filter((record) => !record.freshnessAt || new Date(record.freshnessAt).getTime() < now.getTime())
      .map((record) => record.id),
    lowConfidenceRecordIds: records
      .filter((record) => record.confidence < minimumConfidence)
      .map((record) => record.id),
  });
}

export function requireFreshGrounding(context: GroundedContext): void {
  if (context.records.length === 0) throw new Error("grounding_required");
  if (context.staleRecordIds.length > 0) {
    throw new Error("stale_grounding:" + context.staleRecordIds.join(","));
  }
  if (context.lowConfidenceRecordIds.length > 0) {
    throw new Error("low_confidence_grounding:" + context.lowConfidenceRecordIds.join(","));
  }
}
