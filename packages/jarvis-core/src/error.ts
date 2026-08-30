import { z } from "zod";

export const ErrorEnvelope = z.object({
  ok: z.literal(false),
  code: z.string().min(1),
  message: z.string().min(1),
  requestId: z.string().min(1),
  retryable: z.boolean(),
});

export type ErrorEnvelope = z.infer<typeof ErrorEnvelope>;

export function toErrorEnvelope(error: unknown, requestId: string, code = "JARVIS_RUNTIME_ERROR"): ErrorEnvelope {
  return {
    ok: false,
    code,
    message: error instanceof Error ? error.message : "Unknown runtime error",
    requestId,
    retryable: false,
  };
}
