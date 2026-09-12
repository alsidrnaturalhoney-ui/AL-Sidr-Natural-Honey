import { describe, expect, it } from "vitest";
import { routeBusinessIntent } from "../src/business-routing";

describe("routeBusinessIntent", () => {
  it("routes supplier onboarding to procurement", () => {
    const route = routeBusinessIntent("Check dnata supplier onboarding requirements and any registration fee");
    expect(route.agent).toBe("procurement-agent");
    expect(route.skills).toContain("al-sidr-procurement-command-center");
  });

  it("routes lab evidence to compliance and quality", () => {
    const route = routeBusinessIntent("Review this lab report for moisture and HMF claims");
    expect(route.agent).toBe("security-agent");
    expect(route.skills).toContain("al-sidr-quality-lab-intelligence");
  });

  it("routes Shopify catalog work to commerce", () => {
    const route = routeBusinessIntent("Audit Shopify product pages and marketplace catalog");
    expect(route.agent).toBe("shopify-operator");
  });

  it("routes n8n workflows to automation", () => {
    const route = routeBusinessIntent("Build an n8n webhook sync with retries");
    expect(route.agent).toBe("mcp-governor");
    expect(route.skills).toContain("al-sidr-automation-architect");
  });

  it("falls back to command routing", () => {
    const route = routeBusinessIntent("What is the next highest value task?");
    expect(route.agent).toBe("ceo-command");
  });
});
