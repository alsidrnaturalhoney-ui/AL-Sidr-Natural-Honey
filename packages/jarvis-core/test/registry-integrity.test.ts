import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { createAuthorityRegistryFromConfig } from "../src/authority.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../../..");

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(resolve(root, path), "utf8")) as T;
}

type Agent = {
  id: string;
  skills: string[];
  tools: string[];
  maxRisk: "R0" | "R1" | "R2" | "R3";
};
type Skill = {
  id: string;
  ownerAgent: string;
  capability: string;
  risk: "R0" | "R1" | "R2" | "R3";
};
type Connector = {
  id: string;
  status: string;
  writePolicy: string;
};
type Capability = { name: string };

const agents = readJson<Agent[]>("ai-os/agents/master-registry.json");
const skills = readJson<Skill[]>("ai-os/skills/master-registry.json");
const connectors = readJson<Connector[]>("config/connectors-registry.json");
const capabilities = readJson<Capability[]>("ai-os/capabilities/runtime-registry.json");
const authorityConfig = readJson<unknown>("config/authority-registry.json");
const riskRank = { R0: 0, R1: 1, R2: 2, R3: 3 } as const;

describe("master registry referential integrity", () => {
  it("resolves every agent skill and tool reference", () => {
    const skillIds = new Set(skills.map((skill) => skill.id));
    const connectorIds = new Set(connectors.map((connector) => connector.id));

    for (const agent of agents) {
      expect(
        agent.skills.filter((skill) => !skillIds.has(skill)),
        agent.id + " missing skills",
      ).toEqual([]);
      expect(
        agent.tools.filter((tool) => !connectorIds.has(tool)),
        agent.id + " missing tools",
      ).toEqual([]);
    }
  });

  it("resolves every skill owner and runtime capability", () => {
    const agentIds = new Set(agents.map((agent) => agent.id));
    const capabilityIds = new Set(capabilities.map((capability) => capability.name));

    for (const skill of skills) {
      expect(agentIds.has(skill.ownerAgent), skill.id + " owner").toBe(true);
      expect(capabilityIds.has(skill.capability), skill.id + " capability").toBe(true);
    }
  });

  it("keeps skill risk within the owning agent ceiling", () => {
    const agentById = new Map(agents.map((agent) => [agent.id, agent]));
    for (const skill of skills) {
      const owner = agentById.get(skill.ownerAgent);
      expect(owner, skill.id + " owner exists").toBeDefined();
      expect(
        riskRank[skill.risk] <= riskRank[owner!.maxRisk],
        skill.id + " risk ceiling",
      ).toBe(true);
    }
  });

  it("parses the canonical authority registry as executable configuration", () => {
    const registry = createAuthorityRegistryFromConfig(authorityConfig);
    expect(registry.get("commerce")?.authority).toBe("shopify");
    expect(registry.get("engineering")?.authority).toBe("github");
    expect(registry.get("data")?.authority).toBe("supabase");
  });

  it("never enables unverified connectors for unrestricted writes", () => {
    for (const connector of connectors) {
      if (connector.status === "registered-unverified" || connector.status === "blocked") {
        expect(connector.writePolicy).not.toBe("allowed");
      }
    }
  });
});
