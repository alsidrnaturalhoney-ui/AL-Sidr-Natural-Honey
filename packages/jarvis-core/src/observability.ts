import { randomUUID } from "node:crypto";
import { z } from "zod";

export const TraceEvent = z.object({
  traceId: z.string().min(1),
  spanId: z.string().min(1),
  correlationId: z.string().min(1),
  component: z.string().min(1),
  operation: z.string().min(1),
  status: z.enum(["STARTED", "SUCCEEDED", "FAILED", "BLOCKED"]),
  startedAt: z.string().datetime(),
  finishedAt: z.string().datetime().nullable(),
  attributes: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])),
});

export type TraceEvent = z.infer<typeof TraceEvent>;

export function createTraceEvent(input: {
  traceId?: string;
  correlationId: string;
  component: string;
  operation: string;
  status: TraceEvent["status"];
  startedAt?: string;
  finishedAt?: string | null;
  attributes?: Record<string, string | number | boolean | null>;
}): TraceEvent {
  return TraceEvent.parse({
    traceId: input.traceId ?? randomUUID(),
    spanId: randomUUID(),
    correlationId: input.correlationId,
    component: input.component,
    operation: input.operation,
    status: input.status,
    startedAt: input.startedAt ?? new Date().toISOString(),
    finishedAt: input.finishedAt ?? null,
    attributes: input.attributes ?? {},
  });
}
