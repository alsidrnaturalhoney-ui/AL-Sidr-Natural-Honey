import { describe, expect, it } from "vitest";
import {
  assertAuthority,
  createAuthorityRegistry,
} from "../src/authority.js";
import { hydrateContext, requireFreshGrounding } from "../src/context.js";
import { buildRuntimeEvent } from "../src/events.js";
import { isApprovalValid } from "../src/approval.js";
import { ConnectorManifest } from "../src/manifests.js";
import { evaluateConnectorGate } from "../src/connector-gate.js";

describe("JARVIS authority and connector controls", () => {
  it("blocks writes through a non-authoritative system", () => {
    const registry = createAuthorityRegistry([
      { domain: "commerce", authority: "shopify", mode: "system_of_record" },
    ]);
    expect(() => assertAuthority(registry, "commerce", "airtable")).toThrow(
      /authority_mismatch/,
    );
    expect(assertAuthority(registry, "commerce", "shopify").authority).toBe("shopify");
  });

  it("surfaces stale or low-confidence grounding rather than silently merging it", () => {
    const context = hydrateContext([
      {
        id: "fact-1",
        authorityDomain: "commerce",
        sourceSystem: "shopify",
        sourceRef: "product:1",
        capturedAt: "2026-09-18T05:00:00.000Z",
        freshnessAt: "2026-09-18T05:30:00.000Z",
        confidence: 0.95,
        payload: { price: 125 },
      },
    ], { now: new Date("2026-09-18T06:00:00.000Z") });

    expect(context.staleRecordIds).toEqual(["fact-1"]);
    expect(() => requireFreshGrounding(context)).toThrow(/stale_grounding/);
  });

  it("builds deterministic idempotency keys for equivalent event seeds", () => {
    const a = buildRuntimeEvent({
      eventType: "catalog.changed",
      correlationId: "corr-1",
      source: "shopify",
      payload: { id: "p1" },
    });
    const b = buildRuntimeEvent({
      eventType: "catalog.changed",
      correlationId: "corr-1",
      source: "shopify",
      payload: { id: "p1" },
    });
    expect(a.idempotencyKey).toBe(b.idempotencyKey);
  });

  it("rejects expired approval grants", () => {
    expect(isApprovalValid({
      approvalReference: "approval-1",
      requestId: "req-1",
      stepId: "step-1",
      approverId: "owner",
      decision: "APPROVED",
      approvedAt: "2026-09-18T05:00:00.000Z",
      expiresAt: "2026-09-18T05:30:00.000Z",
    }, {
      requestId: "req-1",
      stepId: "step-1",
    }, new Date("2026-09-18T06:00:00.000Z"))).toBe(false);
  });

  it("blocks unverified connectors and approval-gated writes", () => {
    const unverified = ConnectorManifest.parse({
      id: "marketplace",
      platform: "Marketplace",
      authorityDomain: "marketplaces",
      mode: "adapter",
      status: "registered-unverified",
      allowedOperations: ["write"],
      secretPolicy: "managed-connector",
      maxRisk: "R2",
      writePolicy: "approval-required",
    });
    expect(evaluateConnectorGate({
      connector: unverified,
      operation: "write",
      risk: "R2",
      write: true,
      approvalValid: true,
    }).allowed).toBe(false);

    const verified = ConnectorManifest.parse({
      ...unverified,
      status: "verified-connected",
    });
    expect(evaluateConnectorGate({
      connector: verified,
      operation: "write",
      risk: "R2",
      write: true,
      approvalValid: false,
    }).reason).toBe("connector_approval_required");
  });
});
