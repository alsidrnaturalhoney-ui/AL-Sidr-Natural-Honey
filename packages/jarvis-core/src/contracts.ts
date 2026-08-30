import { z } from "zod";

export const RiskClass = z.enum(["R0", "R1", "R2", "R3", "R4", "R5"]);
export const Decision = z.enum(["ALLOW", "REVIEW", "BLOCK"]);

export const ActionRequest = z.object({
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

export const PolicyDecision = z.object({
  decision: Decision,
  reason: z.string().min(1),
  requestId: z.string().min(1),
});

export const AuditEvent = z.object({
  eventId: z.string().min(1),
  timestamp: z.string().datetime(),
  actor: z.string().min(1),
  capability: z.string().min(1),
  action: z.string().min(1),
  riskClass: RiskClass,
  authorityDomain: z.string().min(1),
  sourceSystem: z.string().min(1),
  targetSystem: z.string().min(1),
  inputHash: z.string().min(1),
  outputHash: z.string().min(1),
  permissionDecision: Decision,
  validationResult: z.string().min(1),
  approvalReference: z.string().nullable(),
  idempotencyKey: z.string().min(1),
  executionStatus: z.enum(["REQUESTED", "VALIDATED", "AUTHORIZED", "EXECUTED", "VERIFIED", "BLOCKED", "REJECTED", "FAILED", "ROLLED_BACK"]),
  verificationEvidence: z.array(z.string()),
  rollbackReference: z.string().nullable(),
  correlationId: z.string().min(1),
});

export type ActionRequest = z.infer<typeof ActionRequest>;
export type PolicyDecision = z.infer<typeof PolicyDecision>;
export type AuditEvent = z.infer<typeof AuditEvent>;
