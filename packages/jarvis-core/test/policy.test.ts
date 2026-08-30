import { describe, expect, it } from "vitest";
import { evaluatePolicy } from "../src/policy";

describe("evaluatePolicy", () => {
  it("allows R0 read actions", () => {
    expect(evaluatePolicy({ requestId: "r0", actor: "agent", capability: "read", authorityDomain: "analytics", operation: "read", risk: "R0", permissions: [], evidence: [], dependencies: [], approvalReference: null, rollbackReference: null }).decision).toBe("ALLOW");
  });

  it("blocks mutations without permissions", () => {
    expect(evaluatePolicy({ requestId: "r2", actor: "agent", capability: "edit", authorityDomain: "content", operation: "write", risk: "R2", permissions: [], evidence: ["e1"], dependencies: [], approvalReference: null, rollbackReference: null }).decision).toBe("BLOCK");
  });

  it("requires approval for R3", () => {
    expect(evaluatePolicy({ requestId: "r3", actor: "agent", capability: "price", authorityDomain: "commerce", operation: "write", risk: "R3", permissions: ["commerce:write"], evidence: ["e1"], dependencies: [], approvalReference: null, rollbackReference: "rb1" }).decision).toBe("REVIEW");
  });
});
