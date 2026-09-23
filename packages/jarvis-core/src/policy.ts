import {
  ActionPlanStep,
  CapabilityManifest,
  ExecutionRequest,
  PolicyDecision,
} from "./contracts.js";

function deny(requestId: string, stepId: string, reason: string): PolicyDecision {
  return { requestId, stepId, decision: "DENY", reason };
}

export function evaluatePolicy(
  inputRequest: ExecutionRequest,
  inputStep: ActionPlanStep,
  inputCapability: CapabilityManifest,
): PolicyDecision {
  let requestId = "unknown";
  let stepId = "unknown";

  try {
    const request = ExecutionRequest.parse(inputRequest);
    const step = ActionPlanStep.parse(inputStep);
    const capability = CapabilityManifest.parse(inputCapability);
    requestId = request.requestId;
    stepId = step.stepId;

    if (request.capability !== capability.name) {
      return deny(requestId, stepId, "request_capability_mismatch");
    }
    if (step.capability !== capability.name) {
      return deny(requestId, stepId, "step_capability_mismatch");
    }
    if (
      !capability.allowedOperations.includes(request.operation) ||
      !capability.allowedOperations.includes(step.operation)
    ) {
      return deny(requestId, stepId, "operation_not_allowed");
    }
    const missingPermission = capability.requiredPermissions.find(
      (permission) => !request.actor.permissions.includes(permission),
    );
    if (missingPermission) {
      return deny(requestId, stepId, "missing_permission");
    }
    if (capability.requiresEvidence && step.evidence.length === 0) {
      return deny(requestId, stepId, "missing_evidence");
    }
    if (!request.actor.authenticated && capability.risk !== "R0") {
      return deny(requestId, stepId, "authentication_required");
    }
    if (request.actor.authStrength < capability.minimumAuthStrength) {
      return deny(requestId, stepId, "strong_auth_required");
    }
    if (capability.requiresRollback && !step.rollbackReference) {
      return deny(requestId, stepId, "rollback_required");
    }
    if (capability.confirmation === "always" && !step.approvalReference) {
      return {
        requestId,
        stepId,
        decision: "REQUIRE_CONFIRMATION",
        reason: "approval_required",
      };
    }
    if (
      capability.confirmation === "risk-default" &&
      (capability.risk === "R2" || capability.risk === "R3") &&
      !step.approvalReference
    ) {
      return {
        requestId,
        stepId,
        decision: "REQUIRE_CONFIRMATION",
        reason: "approval_required",
      };
    }
    if (capability.risk === "R0") {
      return {
        requestId,
        stepId,
        decision: "ALLOW",
        reason: "policy_prerequisites_satisfied",
      };
    }
    if (capability.risk === "R1") {
      return {
        requestId,
        stepId,
        decision: "ALLOW_NOTIFY",
        reason: "policy_prerequisites_satisfied",
      };
    }
    return {
      requestId,
      stepId,
      decision: "ALLOW",
      reason: "policy_prerequisites_satisfied",
    };
  } catch {
    return deny(requestId, stepId, "invalid_policy_request");
  }
}
