import {
  ActionPlanStep,
  ActionResult,
  CapabilityManifest,
  ExecutionRequest,
  VerificationResult,
} from "./contracts.js";

export type VerificationContext = Readonly<{
  request: ExecutionRequest;
  step: ActionPlanStep;
  capability: CapabilityManifest;
  result: ActionResult;
}>;

export interface VerificationAdapter {
  capability: string;
  verify(context: VerificationContext): Promise<{
    matched: boolean;
    evidence: string[];
    observed: Record<string, unknown>;
  }>;
}

export async function verifyPlanStep(
  inputRequest: ExecutionRequest,
  inputStep: ActionPlanStep,
  inputCapability: CapabilityManifest,
  inputResult: ActionResult,
  verifier: VerificationAdapter,
): Promise<VerificationResult> {
  const request = ExecutionRequest.parse(inputRequest);
  const step = ActionPlanStep.parse(inputStep);
  const capability = CapabilityManifest.parse(inputCapability);
  const result = ActionResult.parse(inputResult);

  if (verifier.capability !== capability.name) {
    return VerificationResult.parse({
      stepId: step.stepId,
      matched: false,
      evidence: ["verifier_capability_mismatch"],
      observed: {},
    });
  }

  if (result.status !== "EXECUTED") {
    return VerificationResult.parse({
      stepId: step.stepId,
      matched: false,
      evidence: ["execution_not_successful"],
      observed: result.output,
    });
  }

  try {
    const verified = await verifier.verify({
      request,
      step,
      capability,
      result,
    });

    return VerificationResult.parse({
      stepId: step.stepId,
      matched: verified.matched,
      evidence: verified.evidence,
      observed: verified.observed,
    });
  } catch (error) {
    return VerificationResult.parse({
      stepId: step.stepId,
      matched: false,
      evidence: [
        error instanceof Error ? error.message : "verification_failed",
      ],
      observed: {},
    });
  }
}
