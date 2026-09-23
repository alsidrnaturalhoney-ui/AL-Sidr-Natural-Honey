import {
  ActionPlan,
  ActionPlanStep,
  ExecutionRequest,
} from "./contracts.js";

export type PlanOptions = Readonly<{
  evidence?: string[];
  approvalReference?: string | null;
  rollbackReference?: string | null;
  expectedResult?: Record<string, unknown>;
  dependencies?: string[];
}>;

export function createSingleStepPlan(
  inputRequest: ExecutionRequest,
  options: PlanOptions = {},
): ActionPlan {
  const request = ExecutionRequest.parse(inputRequest);

  const step = ActionPlanStep.parse({
    stepId: `${request.requestId}:step:1`,
    capability: request.capability,
    target: request.target,
    operation: request.operation,
    arguments: request.arguments,
    expectedResult: options.expectedResult ?? {},
    evidence: options.evidence ?? [],
    approvalReference: options.approvalReference ?? null,
    rollbackReference: options.rollbackReference ?? null,
    dependencies: options.dependencies ?? [],
  });

  return ActionPlan.parse({
    planId: `plan:${request.requestId}`,
    requestId: request.requestId,
    correlationId: request.correlationId,
    steps: [step],
  });
}
