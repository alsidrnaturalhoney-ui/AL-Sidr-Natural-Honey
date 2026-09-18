import { randomUUID } from "node:crypto";
import {
  ActionPlanStep,
  ActionResult,
  AuditEvent,
  CapabilityManifest,
  ExecutionRequest,
  ExecutionStatus,
  PolicyDecision,
  VerificationResult,
} from "./contracts.js";
import { stableHash } from "./hash.js";

export type AuditEventInput = Readonly<{
  request: ExecutionRequest;
  step: ActionPlanStep;
  capability: CapabilityManifest;
  decision: PolicyDecision;
  result: ActionResult;
  verification?: VerificationResult;
  status: ExecutionStatus;
}>;

export function buildAuditEvent(input: AuditEventInput): AuditEvent {
  const request = ExecutionRequest.parse(input.request);
  const step = ActionPlanStep.parse(input.step);
  const capability = CapabilityManifest.parse(input.capability);
  const decision = PolicyDecision.parse(input.decision);
  const result = ActionResult.parse(input.result);
  const status = ExecutionStatus.parse(input.status);
  const verification = input.verification
    ? VerificationResult.parse(input.verification)
    : undefined;

  return AuditEvent.parse({
    eventId: randomUUID(),
    timestamp: new Date().toISOString(),
    actorId: request.actor.id,
    requestId: request.requestId,
    correlationId: request.correlationId,
    capability: capability.name,
    target: step.target,
    riskClass: capability.risk,
    policyDecision: decision.decision,
    executionStatus: status,
    inputHash: stableHash({
      capability: request.capability,
      operation: request.operation,
      target: request.target,
      arguments: request.arguments,
    }),
    outputHash: stableHash(result.output),
    approvalReference: step.approvalReference,
    verificationEvidence: verification?.evidence ?? [],
  });
}

export interface AuditSink {
  append(event: AuditEvent): Promise<void>;
}
