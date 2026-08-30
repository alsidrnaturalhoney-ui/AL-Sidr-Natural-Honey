import { ActionRequest, Decision, PolicyDecision } from "./contracts";

const rank: Record<ActionRequest["risk"], number> = { R0: 0, R1: 1, R2: 2, R3: 3, R4: 4, R5: 5 };

export function evaluatePolicy(input: ActionRequest): PolicyDecision {
  try {
    const request = ActionRequest.parse(input);
    const missingPermission = request.risk !== "R0" && request.permissions.length === 0;
    const missingEvidence = request.risk !== "R0" && request.evidence.length === 0;
    const highRisk = rank[request.risk] >= 3;
    const missingApproval = highRisk && !request.approvalReference;
    const missingRollback = rank[request.risk] >= 3 && !request.rollbackReference;

    if (missingPermission) return { decision: "BLOCK", reason: "Missing permission", requestId: request.requestId };
    if (missingEvidence) return { decision: "REVIEW", reason: "Required evidence is missing", requestId: request.requestId };
    if (missingApproval) return { decision: "REVIEW", reason: "Explicit approval is required", requestId: request.requestId };
    if (missingRollback) return { decision: "BLOCK", reason: "Rollback reference is required for high-risk mutation", requestId: request.requestId };

    const decision: Decision = request.risk === "R2" ? "REVIEW" : "ALLOW";
    return { decision, reason: "Policy prerequisites satisfied", requestId: request.requestId };
  } catch (error) {
    return { decision: "BLOCK", reason: error instanceof Error ? error.message : "Invalid policy request", requestId: "unknown" };
  }
}
