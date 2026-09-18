import { describe, expect, it } from "vitest";
import {
  createAgentRegistry,
  createConnectorRegistry,
  createSkillRegistry,
} from "../src/manifests.js";

describe("agent, skill and connector manifests", () => {
  it("registers a least-privilege agent manifest", () => {
    const registry = createAgentRegistry([{
      id: "agent.test",
      name: "Test Agent",
      version: "1.0.0",
      purpose: "Validate registry behavior.",
      authorityDomains: ["test"],
      skills: ["test.read"],
      tools: ["fixture"],
      maxRisk: "R1",
      memoryScope: ["test"],
      escalationTarget: "jarvis.prime",
      enabled: true,
    }]);
    expect(registry.get("agent.test")?.maxRisk).toBe("R1");
  });

  it("rejects duplicate skill ids", () => {
    const skill = {
      id: "test.read",
      version: "1.0.0",
      purpose: "Read fixture data.",
      ownerAgent: "agent.test",
      capability: "knowledge.read",
      authorityDomain: "test",
      risk: "R0",
      requiredEvidence: ["fixture"],
      approvalPolicy: "never",
      rollback: "not-required",
      enabled: true,
    };
    expect(() => createSkillRegistry([skill, skill])).toThrow(/duplicate_skill/);
  });

  it("requires explicit connector write policy", () => {
    expect(() => createConnectorRegistry([{
      id: "fixture",
      platform: "Fixture",
      authorityDomain: "test",
      mode: "adapter",
      status: "verified-connected",
      allowedOperations: ["read"],
      secretPolicy: "managed-connector",
      maxRisk: "R1",
    }])).toThrow();
  });
});
