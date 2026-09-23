import { randomUUID } from "node:crypto";
import { z } from "zod";
import { stableHash } from "./hash.js";

export const RuntimeEvent = z.object({
  eventId: z.string().min(1),
  eventType: z.string().min(1),
  correlationId: z.string().min(1),
  source: z.string().min(1),
  occurredAt: z.string().datetime(),
  idempotencyKey: z.string().min(1),
  payload: z.record(z.unknown()),
});

export type RuntimeEvent = z.infer<typeof RuntimeEvent>;

export function buildRuntimeEvent(input: {
  eventType: string;
  correlationId: string;
  source: string;
  payload: Record<string, unknown>;
  occurredAt?: string;
  idempotencySeed?: unknown;
}): RuntimeEvent {
  const occurredAt = input.occurredAt ?? new Date().toISOString();
  const idempotencyKey = stableHash(
    input.idempotencySeed ?? {
      eventType: input.eventType,
      correlationId: input.correlationId,
      source: input.source,
      payload: input.payload,
    },
  );

  return RuntimeEvent.parse({
    eventId: randomUUID(),
    eventType: input.eventType,
    correlationId: input.correlationId,
    source: input.source,
    occurredAt,
    idempotencyKey,
    payload: input.payload,
  });
}
