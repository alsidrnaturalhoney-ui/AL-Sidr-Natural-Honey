import { describe, expect, it } from "vitest";
import type {
  ActionPlanStep,
  CapabilityManifest,
  ExecutionRequest,
  RiskClass,
} from "../src/contracts.js";
import { evaluatePolicy } from "../src/policy.js";

function fixture(
  risk: RiskClass,
  options: {
    authStrength?: number;
    permissions?: string[];
    approvalReference?: string | null;
    rollbackReference?: string | null;
    operation?: string;
  } = {},
): {
  request: ExecutionRequest;
  step: ActionPlanStep;
  capability: CapabilityManifest;
} {
  const operation = options.operation ?? "execute";
  const requiredPermissions = risk === "R0" ? [] : ["capability:use"];
  const request: ExecutionRequest = {
    requestId: `req-${risk}`,
    correlationId: `corr-${risk}`,
    actor: {
      id: "user-1",
      sessionId: "session-1",
      authenticated: true,
      authStrength: options.authStrength ?? (risk === "R3" ? 2 : 1),
      permissions: options.permissions ?? requiredPermissions,
    },
    source: "chat",
    requestedOutcome: "Execute governed action",
    target: "test-resource",
    capability: `test.${risk.toLowerCase()}`,
    operation,
    arguments: {},
    confidence: 1,
    timestamp: "2026-09-13T13:50:00.000Z",
  };
  const step: ActionPlanStep = {
    stepId: `step-${risk}`,
    capability: request.capability,
    target: request.target,
    operation,
    arguments: {},
    expectedResult: {},
    evidence: risk === "R0" ? [] : ["verified-input"],
    approvalReference: options.approvalReference ?? null,
    rollbackReference:
      options.rollbackReference === undefined
        ? risk === "R3"
          ? "rollback-1"
          : null
        : options.rollbackReference,
    dependencies: [],
  };
  const capability: CapabilityManifest = {
    name: request.capability,
    version: "1.0.0",
    provider: "test",
    risk,
    mode: risk === "R0" ? "read" : "write",
    allowedOperations: ["execute"],
    requiredPermissions,
    confirmation: risk === "R0" || risk === "R1" ? "never" : "risk-default",
    requiresEvidence: risk !== "R0",
    requiresRollback: risk === "R3",
    minimumAuthStrength: risk === "R3" ? 2 : risk === "R0" ? 0 : 1,
    verificationStrategy: "test-observation",
    enabledEnvironments: ["test"],
  };
  return { request, step, capability };
}

describe("evaluatePolicy", () => {
  it("allows R0 reads", () => {
    const f = fixture("R0");
    expect(evaluatePolicy(f.request, f.step, f.capability).decision).toBe("ALLOW");
  });

  it("allows R1 routine writes with notify semantics", () => {
    const f = fixture("R1");
    expect(evaluatePolicy(f.request, f.step, f.capability).decision).toBe("ALLOW_NOTIFY");
  });

  it("requires confirmation for unapproved R2 actions", () => {
    const f = fixture("R2");
    expect(evaluatePolicy(f.request, f.step, f.capability).decision).toBe("REQUIRE_CONFIRMATION");
  });

  it("allows approved R2 actions", () => {
    const f = fixture("R2", { approvalReference: "approval-1" });
    expect(evaluatePolicy(f.request, f.step, f.capability).decision).toBe("ALLOW");
  });

  it("denies R3 without strong authentication", () => {
    const f = fixture("R3", { authStrength: 1 });
    expect(evaluatePolicy(f.request, f.step, f.capability).decision).toBe("DENY");
  });

  it("denies R3 without rollback evidence", () => {
    const f = fixture("R3", { rollbackReference: null });
    expect(evaluatePolicy(f.request, f.step, f.capability).decision).toBe("DENY");
  });

  it("requires confirmation for otherwise valid R3", () => {
    const f = fixture("R3");
    expect(evaluatePolicy(f.request, f.step, f.capability).decision).toBe("REQUIRE_CONFIRMATION");
  });

  it("denies missing required permissions", () => {
    const f = fixture("R2", { permissions: [] });
    expect(evaluatePolicy(f.request, f.step, f.capability).decision).toBe("DENY");
  });

  it("denies operations outside the capability allowlist", () => {
    const f = fixture("R1", { operation: "delete" });
    expect(evaluatePolicy(f.request, f.step, f.capability).decision).toBe("DENY");
  });
});
