import { z } from "zod";

export const RiskClass = z.enum(["R0", "R1", "R2", "R3"]);
export const PolicyDecisionType = z.enum([
  "ALLOW",
  "ALLOW_NOTIFY",
  "REQUIRE_CONFIRMATION",
  "DENY",
]);
export const ExecutionStatus = z.enum([
  "REQUESTED",
  "PLANNED",
  "WAITING_APPROVAL",
  "AUTHORIZED",
  "EXECUTED",
  "VERIFIED",
  "PARTIAL",
  "FAILED",
  "CANCELLED",
  "DENIED",
]);

export const ActorContext = z.object({
  id: z.string().min(1),
  sessionId: z.string().min(1),
  authenticated: z.boolean(),
  authStrength: z.number().int().min(0).max(3),
});

export const ExecutionRequest = z.object({
  requestId: z.string().min(1),
  correlationId: z.string().min(1),
  actor: ActorContext,
  source: z.enum(["chat", "web", "schedule", "webhook", "system"]),
  requestedOutcome: z.string().min(1),
  target: z.string().min(1),
  capability: z.string().min(1),
  operation: z.string().min(1),
  arguments: z.record(z.unknown()),
  confidence: z.number().min(0).max(1),
  timestamp: z.string().datetime(),
});

export const CapabilityManifest = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
  provider: z.string().min(1),
  risk: RiskClass,
  mode: z.enum(["read", "write"]),
  allowedOperations: z.array(z.string().min(1)).min(1),
  requiredPermissions: z.array(z.string().min(1)),
  confirmation: z.enum(["never", "risk-default", "always"]),
  requiresEvidence: z.boolean(),
  requiresRollback: z.boolean(),
  minimumAuthStrength: z.number().int().min(0).max(3),
  verificationStrategy: z.string().min(1),
  enabledEnvironments: z
    .array(z.enum(["test", "development", "staging", "production"]))
    .min(1),
});

export const ActionPlanStep = z.object({
  stepId: z.string().min(1),
  capability: z.string().min(1),
  target: z.string().min(1),
  operation: z.string().min(1),
  arguments: z.record(z.unknown()),
  expectedResult: z.record(z.unknown()),
  evidence: z.array(z.string()),
  approvalReference: z.string().nullable(),
  rollbackReference: z.string().nullable(),
  dependencies: z.array(z.string()),
});

export const ActionPlan = z.object({
  planId: z.string().min(1),
  requestId: z.string().min(1),
  correlationId: z.string().min(1),
  steps: z.array(ActionPlanStep).min(1),
});

export const PolicyDecision = z.object({
  requestId: z.string().min(1),
  stepId: z.string().min(1),
  decision: PolicyDecisionType,
  reason: z.string().min(1),
});

export const ActionResult = z.object({
  stepId: z.string().min(1),
  status: z.enum(["EXECUTED", "PARTIAL", "FAILED", "CANCELLED"]),
  output: z.record(z.unknown()),
});

export const VerificationResult = z.object({
  stepId: z.string().min(1),
  matched: z.boolean(),
  evidence: z.array(z.string()),
  observed: z.record(z.unknown()),
});

export const AuditEvent = z.object({
  eventId: z.string().min(1),
  timestamp: z.string().datetime(),
  actorId: z.string().min(1),
  requestId: z.string().min(1),
  correlationId: z.string().min(1),
  capability: z.string().min(1),
  target: z.string().min(1),
  riskClass: RiskClass,
  policyDecision: PolicyDecisionType,
  executionStatus: ExecutionStatus,
  inputHash: z.string().min(1),
  outputHash: z.string().min(1),
  approvalReference: z.string().nullable(),
  verificationEvidence: z.array(z.string()),
});

// Transitional compatibility for the pre-v1 evaluator. This is not the
// canonical Core v1 decision vocabulary and is removed when Task 3 lands.
export const LegacyDecision = z.enum(["ALLOW", "REVIEW", "BLOCK"]);
export const LegacyActionRequest = z.object({
  requestId: z.string().min(1),
  actor: z.string().min(1),
  capability: z.string().min(1),
  authorityDomain: z.string().min(1),
  operation: z.string().min(1),
  risk: RiskClass,
  permissions: z.array(z.string()),
  evidence: z.array(z.string()),
  dependencies: z.array(z.string()),
  approvalReference: z.string().nullable(),
  rollbackReference: z.string().nullable(),
});
export const LegacyPolicyDecision = z.object({
  decision: LegacyDecision,
  reason: z.string().min(1),
  requestId: z.string().min(1),
});

export type RiskClass = z.infer<typeof RiskClass>;
export type PolicyDecisionType = z.infer<typeof PolicyDecisionType>;
export type ActorContext = z.infer<typeof ActorContext>;
export type ExecutionRequest = z.infer<typeof ExecutionRequest>;
export type CapabilityManifest = z.infer<typeof CapabilityManifest>;
export type ActionPlanStep = z.infer<typeof ActionPlanStep>;
export type ActionPlan = z.infer<typeof ActionPlan>;
export type PolicyDecision = z.infer<typeof PolicyDecision>;
export type ActionResult = z.infer<typeof ActionResult>;
export type VerificationResult = z.infer<typeof VerificationResult>;
export type AuditEvent = z.infer<typeof AuditEvent>;
export type LegacyActionRequest = z.infer<typeof LegacyActionRequest>;
export type LegacyPolicyDecision = z.infer<typeof LegacyPolicyDecision>;
