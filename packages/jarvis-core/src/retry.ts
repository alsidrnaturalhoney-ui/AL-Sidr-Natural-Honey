export type RetryPolicy = Readonly<{
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  retryableCodes: readonly string[];
  requiresIdempotency: boolean;
}>;

export function validateRetryPolicy(
  policy: RetryPolicy,
  context: { idempotencyKey?: string; write: boolean },
): void {
  if (!Number.isInteger(policy.maxAttempts) || policy.maxAttempts < 1 || policy.maxAttempts > 5) {
    throw new Error("invalid_retry_attempts");
  }
  if (policy.baseDelayMs < 0 || policy.maxDelayMs < policy.baseDelayMs) {
    throw new Error("invalid_retry_delay");
  }
  if (
    context.write &&
    policy.requiresIdempotency &&
    (!context.idempotencyKey || context.idempotencyKey.trim().length === 0)
  ) {
    throw new Error("idempotency_required_for_retry");
  }
}

export function retryDelayMs(policy: RetryPolicy, attempt: number): number {
  if (attempt < 1) throw new Error("invalid_retry_attempt");
  return Math.min(policy.maxDelayMs, policy.baseDelayMs * 2 ** (attempt - 1));
}
