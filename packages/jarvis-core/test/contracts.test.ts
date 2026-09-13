import { describe, expect, it } from "vitest";
import {
  CapabilityManifest,
  ExecutionRequest,
  PolicyDecisionType,
  RiskClass,
} from "../src/contracts.js";

describe("JARVIS Core v1 contracts", () => {
  it("accepts only R0-R3 risk classes", () => {
    expect(RiskClass.options).toEqual(["R0", "R1", "R2", "R3"]);
    expect(() => RiskClass.parse("R4")).toThrow();
  });

  it("uses the four approved policy decisions", () => {
    expect(PolicyDecisionType.options).toEqual([
      "ALLOW",
      "ALLOW_NOTIFY",
      "REQUIRE_CONFIRMATION",
      "DENY",
    ]);
  });

  it("requires correlation, actor, target and capability on execution requests", () => {
    expect(() => ExecutionRequest.parse({ requestId: "r1" })).toThrow();
  });

  it("requires a verification strategy on capability manifests", () => {
    expect(() => CapabilityManifest.parse({
      name: "system.health.read",
      version: "1.0.0",
      provider: "internal",
      risk: "R0",
      mode: "read",
      allowedOperations: ["read"],
      requiredPermissions: [],
      confirmation: "never",
      requiresEvidence: false,
      requiresRollback: false,
      minimumAuthStrength: 0,
      enabledEnvironments: ["test"],
    })).toThrow();
  });
});
