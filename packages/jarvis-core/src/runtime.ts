import {
  ActionResult,
  AuditEvent,
  ExecutionRequest,
  ExecutionStatus,
  PolicyDecision,
  VerificationResult,
} from "./contracts.js";
import { buildAuditEvent, AuditSink } from "./audit.js";
import { CapabilityAdapter, executePlanStep } from "./executor.js";
import { createSingleStepPlan, PlanOptions } from "./planner.js";
import { evaluatePolicy } from "./policy.js";
import { CapabilityRegistry } from "./registry.js";
import { routeRequest } from "./router.js";
import { VerificationAdapter, verifyPlanStep } from "./verifier.js";

export type RuntimeDependencies = Readonly<{
  capabilities: CapabilityRegistry;
  adapters: ReadonlyMap<string, CapabilityAdapter>;
  verifiers: ReadonlyMap<string, VerificationAdapter>;
  auditSink?: AuditSink;
}>;

export type RuntimeOutcome = Readonly<{
  status: ExecutionStatus;
  decision: PolicyDecision;
  result: ActionResult;
  verification?: VerificationResult;
  auditEvent: AuditEvent;
}>;

function syntheticResult(
  stepId: string,
  reason: string,
  decision: PolicyDecision["decision"],
): ActionResult {
  return ActionResult.parse({
    stepId,
    status: "CANCELLED",
    output: { reason, decision },
  });
}

export async function runExecution(
  inputRequest: ExecutionRequest,
  dependencies: RuntimeDependencies,
  planOptions: PlanOptions = {},
): Promise<RuntimeOutcome> {
  const routed = routeRequest(inputRequest, dependencies.capabilities);
  const plan = createSingleStepPlan(routed.request, planOptions);
  const step = plan.steps[0];

  if (!step) {
    throw new Error("empty_plan");
  }

  const decision = evaluatePolicy(routed.request, step, routed.capability);

  if (decision.decision === "DENY") {
    const result = syntheticResult(step.stepId, decision.reason, decision.decision);
    const auditEvent = buildAuditEvent({
      request: routed.request,
      step,
      capability: routed.capability,
      decision,
      result,
      status: "DENIED",
    });
    await dependencies.auditSink?.append(auditEvent);
    return { status: "DENIED", decision, result, auditEvent };
  }

  if (decision.decision === "REQUIRE_CONFIRMATION") {
    const result = syntheticResult(step.stepId, decision.reason, decision.decision);
    const auditEvent = buildAuditEvent({
      request: routed.request,
      step,
      capability: routed.capability,
      decision,
      result,
      status: "WAITING_APPROVAL",
    });
    await dependencies.auditSink?.append(auditEvent);
    return {
      status: "WAITING_APPROVAL",
      decision,
      result,
      auditEvent,
    };
  }

  const adapter = dependencies.adapters.get(routed.capability.name);
  if (!adapter) {
    const result = ActionResult.parse({
      stepId: step.stepId,
      status: "FAILED",
      output: { reason: "adapter_not_registered" },
    });
    const auditEvent = buildAuditEvent({
      request: routed.request,
      step,
      capability: routed.capability,
      decision,
      result,
      status: "FAILED",
    });
    await dependencies.auditSink?.append(auditEvent);
    return { status: "FAILED", decision, result, auditEvent };
  }

  const result = await executePlanStep(
    routed.request,
    step,
    routed.capability,
    decision,
    adapter,
  );

  if (result.status !== "EXECUTED") {
    const auditEvent = buildAuditEvent({
      request: routed.request,
      step,
      capability: routed.capability,
      decision,
      result,
      status: "FAILED",
    });
    await dependencies.auditSink?.append(auditEvent);
    return { status: "FAILED", decision, result, auditEvent };
  }

  const verifier = dependencies.verifiers.get(routed.capability.name);
  if (!verifier) {
    const auditEvent = buildAuditEvent({
      request: routed.request,
      step,
      capability: routed.capability,
      decision,
      result,
      status: "PARTIAL",
    });
    await dependencies.auditSink?.append(auditEvent);
    return { status: "PARTIAL", decision, result, auditEvent };
  }

  const verification = await verifyPlanStep(
    routed.request,
    step,
    routed.capability,
    result,
    verifier,
  );

  const status: ExecutionStatus = verification.matched ? "VERIFIED" : "PARTIAL";
  const auditEvent = buildAuditEvent({
    request: routed.request,
    step,
    capability: routed.capability,
    decision,
    result,
    verification,
    status,
  });
  await dependencies.auditSink?.append(auditEvent);

  return {
    status,
    decision,
    result,
    verification,
    auditEvent,
  };
}
