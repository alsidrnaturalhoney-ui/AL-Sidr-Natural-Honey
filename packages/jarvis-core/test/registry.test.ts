import { describe, expect, it } from "vitest";
import type { CapabilityManifest } from "../src/contracts.js";
import {
  createCapabilityRegistry,
  getCapability,
  listCapabilities,
} from "../src/registry.js";

const health: CapabilityManifest = {
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
  verificationStrategy: "compare returned health schema",
  enabledEnvironments: ["test", "development", "staging", "production"],
};

describe("capability registry", () => {
  it("registers and retrieves validated capabilities", () => {
    const registry = createCapabilityRegistry([health]);
    expect(getCapability(registry, health.name)).toEqual(health);
    expect(listCapabilities(registry)).toEqual([health]);
  });

  it("rejects duplicate capability names", () => {
    expect(() => createCapabilityRegistry([health, health])).toThrow(/duplicate_capability/);
  });

  it("rejects invalid manifests", () => {
    expect(() => createCapabilityRegistry([{ ...health, risk: "R9" }])).toThrow();
  });

  it("fails closed for unknown capabilities", () => {
    const registry = createCapabilityRegistry([health]);
    expect(getCapability(registry, "unknown.capability")).toBeUndefined();
  });
});
