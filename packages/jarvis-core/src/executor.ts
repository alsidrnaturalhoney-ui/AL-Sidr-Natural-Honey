import {
  ActionPlanStep,
  ActionResult,
  CapabilityManifest,
  ExecutionRequest,
  PolicyDecision,
} from "./contracts.js";

export type AdapterExecutionContext = Readonly<{
  request: ExecutionRequest;
  step: ActionPlanStep;
  capability: CapabilityManifest;
}>;

export interface CapabilityAdapter {
  capability: string;
  execute(
    context: AdapterExecutionContext,
  ): Promise<Record<string, unknown>>;
}

export async function executePlanStep(
  inputRequest: ExecutionRequest,
  inputStep: ActionPlanStep,
  inputCapability: CapabilityManifest,
  inputDecision: PolicyDecision,
  adapter: CapabilityAdapter,
): Promise<ActionResult> {
  const request = ExecutionRequest.parse(inputRequest);
  const step = ActionPlanStep.parse(inputStep);
  const capability = CapabilityManifest.parse(inputCapability);
  const decision = PolicyDecision.parse(inputDecision);

  if (decision.decision !== "ALLOW" && decision.decision !== "ALLOW_NOTIFY") {
    return ActionResult.parse({
      stepId: step.stepId,
      status: "CANCELLED",
      output: {
        reason: decision.reason,
        decision: decision.decision,
      },
    });
  }

  if (adapter.capability !== capability.name) {
    return ActionResult.parse({
      stepId: step.stepId,
      status: "FAILED",
      output: { reason: "adapter_capability_mismatch" },
    });
  }

  if (
    request.capability !== step.capability ||
    request.capability !== capability.name
  ) {
    return ActionResult.parse({
      stepId: step.stepId,
      status: "FAILED",
      output: { reason: "execution_capability_mismatch" },
    });
  }

  try {
    const output = await adapter.execute({ request, step, capability });
    return ActionResult.parse({
      stepId: step.stepId,
      status: "EXECUTED",
      output,
    });
  } catch (error) {
    return ActionResult.parse({
      stepId: step.stepId,
      status: "FAILED",
      output: {
        reason: error instanceof Error ? error.message : "adapter_execution_failed",
      },
    });
  }
}
