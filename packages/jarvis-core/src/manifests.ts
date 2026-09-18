import { z } from "zod";
import { RiskClass } from "./contracts.js";

export const AgentManifest = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().min(1),
  purpose: z.string().min(1),
  authorityDomains: z.array(z.string().min(1)).min(1),
  skills: z.array(z.string().min(1)),
  tools: z.array(z.string().min(1)),
  maxRisk: RiskClass,
  memoryScope: z.array(z.string().min(1)),
  escalationTarget: z.string().min(1),
  enabled: z.boolean(),
});

export const SkillManifest = z.object({
  id: z.string().min(1),
  version: z.string().min(1),
  purpose: z.string().min(1),
  ownerAgent: z.string().min(1),
  capability: z.string().min(1),
  authorityDomain: z.string().min(1),
  risk: RiskClass,
  requiredEvidence: z.array(z.string().min(1)),
  approvalPolicy: z.enum(["never", "risk-default", "always"]),
  rollback: z.enum(["not-required", "required"]),
  enabled: z.boolean(),
});

export const ConnectorManifest = z.object({
  id: z.string().min(1),
  platform: z.string().min(1),
  authorityDomain: z.string().min(1),
  mode: z.enum(["authority", "adapter", "orchestrator", "observer"]),
  status: z.enum([
    "verified-connected",
    "connected-limited",
    "registered-unverified",
    "blocked",
  ]),
  allowedOperations: z.array(z.string().min(1)),
  secretPolicy: z.enum(["env-only", "managed-connector", "none"]),
  maxRisk: RiskClass,
  writePolicy: z.enum(["disabled", "approval-required", "allowed"]),
});

export type AgentManifest = z.infer<typeof AgentManifest>;
export type SkillManifest = z.infer<typeof SkillManifest>;
export type ConnectorManifest = z.infer<typeof ConnectorManifest>;

function createRegistry<T extends { id: string }>(
  values: T[],
  kind: string,
): ReadonlyMap<string, T> {
  const registry = new Map<string, T>();
  for (const value of values) {
    if (registry.has(value.id)) {
      throw new Error(`duplicate_${kind}:${value.id}`);
    }
    registry.set(value.id, Object.freeze({ ...value }));
  }
  return registry;
}

export function createAgentRegistry(inputs: unknown[]): ReadonlyMap<string, AgentManifest> {
  return createRegistry(inputs.map((input) => AgentManifest.parse(input)), "agent");
}

export function createSkillRegistry(inputs: unknown[]): ReadonlyMap<string, SkillManifest> {
  return createRegistry(inputs.map((input) => SkillManifest.parse(input)), "skill");
}

export function createConnectorRegistry(
  inputs: unknown[],
): ReadonlyMap<string, ConnectorManifest> {
  return createRegistry(
    inputs.map((input) => ConnectorManifest.parse(input)),
    "connector",
  );
}
