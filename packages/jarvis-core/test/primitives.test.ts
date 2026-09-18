import { describe, expect, it, vi } from "vitest";
import type {
  ActionPlanStep,
  CapabilityManifest,
  ExecutionRequest,
} from "../src/contracts.js";
import { stableHash } from "../src/hash.js";
import { detectProjectionDrift } from "../src/drift.js";
import { assertSyncDirection } from "../src/sync.js";
import { retryDelayMs, validateRetryPolicy } from "../src/retry.js";
import { createTraceEvent } from "../src/observability.js";
import { ConnectorManifest } from "../src/manifests.js";
import { createGovernedConnectorAdapter } from "../src/connector-adapter.js";

describe("JARVIS orchestration primitives", () => {
  it("hashes nested objects canonically without dropping nested fields", () => {
    const a = stableHash({ outer: { b: 2, a: 1 }, list: [{ z: 3, y: 2 }] });
    const b = stableHash({ list: [{ y: 2, z: 3 }], outer: { a: 1, b: 2 } });
    const c = stableHash({ outer: { b: 9, a: 1 }, list: [{ z: 3, y: 2 }] });
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });

  it("reports projection drift against authoritative content", () => {
    expect(detectProjectionDrift({ v: 1 }, { v: 1 }).state).toBe("GREEN");
    expect(detectProjectionDrift({ v: 1 }, { v: 2 }).state).toBe("RED");
    expect(
      detectProjectionDrift({ v: 1 }, { v: 1 }, { projectionVerified: false }).state,
    ).toBe("AMBER");
  });

  it("blocks reverse or disabled one-way syncs", () => {
    const contract = {
      id: "github-to-supabase",
      sourceSystem: "github",
      targetSystem: "supabase",
      authorityDomain: "jarvis",
      direction: "one-way",
      conflictPolicy: "authority-wins",
      mutationEnabled: true,
    };
    expect(assertSyncDirection(contract, "github", "supabase").id).toBe(contract.id);
    expect(() => assertSyncDirection(contract, "supabase", "github")).toThrow(
      /sync_direction_violation/,
    );
    expect(() =>
      assertSyncDirection({ ...contract, mutationEnabled: false }, "github", "supabase"),
    ).toThrow(/sync_mutation_disabled/);
  });

  it("requires idempotency before retrying writes and bounds delay", () => {
    const policy = {
      maxAttempts: 3,
      baseDelayMs: 100,
      maxDelayMs: 250,
      retryableCodes: ["TIMEOUT"],
      requiresIdempotency: true,
    };
    expect(() => validateRetryPolicy(policy, { write: true })).toThrow(
      /idempotency_required/,
    );
    expect(() =>
      validateRetryPolicy(policy, { write: true, idempotencyKey: "key-1" }),
    ).not.toThrow();
    expect(retryDelayMs(policy, 1)).toBe(100);
    expect(retryDelayMs(policy, 3)).toBe(250);
  });

  it("creates correlation-ready trace events", () => {
    const event = createTraceEvent({
      correlationId: "corr-1",
      component: "router",
      operation: "route",
      status: "SUCCEEDED",
      attributes: { risk: "R0" },
    });
    expect(event.correlationId).toBe("corr-1");
    expect(event.spanId.length).toBeGreaterThan(0);
  });

  it("gates connector invocation before calling the client", async () => {
    const capability: CapabilityManifest = {
      name: "knowledge.read",
      version: "1.0.0",
      provider: "fixture",
      risk: "R0",
      mode: "read",
      allowedOperations: ["read"],
      requiredPermissions: [],
      confirmation: "never",
      requiresEvidence: false,
      requiresRollback: false,
      minimumAuthStrength: 0,
      verificationStrategy: "read-back",
      enabledEnvironments: ["test"],
    };
    const connector = ConnectorManifest.parse({
      id: "fixture",
      platform: "Fixture",
      authorityDomain: "knowledge",
      mode: "adapter",
      status: "registered-unverified",
      allowedOperations: ["read"],
      secretPolicy: "managed-connector",
      maxRisk: "R0",
      writePolicy: "disabled",
    });
    const invoke = vi.fn(async () => ({ ok: true }));
    const adapter = createGovernedConnectorAdapter({
      capability,
      connector,
      client: { invoke },
    });
    const request: ExecutionRequest = {
      requestId: "req-1",
      correlationId: "corr-1",
      actor: {
        id: "user",
        sessionId: "session",
        authenticated: true,
        authStrength: 1,
        permissions: [],
      },
      source: "chat",
      requestedOutcome: "read",
      target: "fixture",
      capability: capability.name,
      operation: "read",
      arguments: {},
      confidence: 1,
      timestamp: "2026-09-18T06:00:00.000Z",
    };
    const step: ActionPlanStep = {
      stepId: "step-1",
      capability: capability.name,
      target: "fixture",
      operation: "read",
      arguments: {},
      expectedResult: {},
      evidence: [],
      approvalReference: null,
      rollbackReference: null,
      dependencies: [],
    };

    await expect(adapter.execute({ request, step, capability })).rejects.toThrow(
      /connector_not_verified/,
    );
    expect(invoke).not.toHaveBeenCalled();
  });
});
