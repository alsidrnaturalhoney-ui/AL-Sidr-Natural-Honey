import { describe, expect, it, vi } from "vitest";
import type {
  CapabilityManifest,
  ExecutionRequest,
} from "../src/contracts.js";
import { createCapabilityRegistry } from "../src/registry.js";
import type { AuditSink } from "../src/audit.js";
import type { CapabilityAdapter } from "../src/executor.js";
import type { VerificationAdapter } from "../src/verifier.js";
import { runExecution } from "../src/runtime.js";

function request(capability: string, operation: string): ExecutionRequest {
  return {
    requestId: "req-1",
    correlationId: "corr-1",
    actor: {
      id: "user-1",
      sessionId: "session-1",
      authenticated: true,
      authStrength: 2,
      permissions: ["content:publish"],
    },
    source: "chat",
    requestedOutcome: "Execute governed test action",
    target: "fixture",
    capability,
    operation,
    arguments: { value: 1 },
    confidence: 1,
    timestamp: "2026-09-18T06:00:00.000Z",
  };
}

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
  verificationStrategy: "read-back",
  enabledEnvironments: ["test"],
};

const publish: CapabilityManifest = {
  name: "external.content.publish",
  version: "1.0.0",
  provider: "fixture",
  risk: "R2",
  mode: "write",
  allowedOperations: ["publish"],
  requiredPermissions: ["content:publish"],
  confirmation: "always",
  requiresEvidence: true,
  requiresRollback: true,
  minimumAuthStrength: 1,
  verificationStrategy: "provider-read-back",
  enabledEnvironments: ["test"],
};

describe("JARVIS governed runtime", () => {
  it("executes, independently verifies and audits an allowed R0 action", async () => {
    const append = vi.fn();
    const auditSink: AuditSink = { append };
    const adapter: CapabilityAdapter = {
      capability: health.name,
      execute: async () => ({ ok: true }),
    };
    const verifier: VerificationAdapter = {
      capability: health.name,
      verify: async () => ({
        matched: true,
        evidence: ["health-read-back"],
        observed: { ok: true },
      }),
    };

    const outcome = await runExecution(request(health.name, "read"), {
      capabilities: createCapabilityRegistry([health]),
      adapters: new Map([[health.name, adapter]]),
      verifiers: new Map([[health.name, verifier]]),
      auditSink,
    });

    expect(outcome.status).toBe("VERIFIED");
    expect(outcome.verification?.matched).toBe(true);
    expect(outcome.auditEvent.executionStatus).toBe("VERIFIED");
    expect(append).toHaveBeenCalledOnce();
  });

  it("stops an R2 action at the approval gate before adapter execution", async () => {
    const execute = vi.fn(async () => ({ published: true }));
    const adapter: CapabilityAdapter = {
      capability: publish.name,
      execute,
    };

    const outcome = await runExecution(
      request(publish.name, "publish"),
      {
        capabilities: createCapabilityRegistry([publish]),
        adapters: new Map([[publish.name, adapter]]),
        verifiers: new Map(),
      },
      {
        evidence: ["approved-copy"],
        rollbackReference: "rollback-1",
      },
    );

    expect(outcome.status).toBe("WAITING_APPROVAL");
    expect(outcome.decision.decision).toBe("REQUIRE_CONFIRMATION");
    expect(execute).not.toHaveBeenCalled();
  });

  it("fails closed when an allowed capability has no adapter", async () => {
    const outcome = await runExecution(request(health.name, "read"), {
      capabilities: createCapabilityRegistry([health]),
      adapters: new Map(),
      verifiers: new Map(),
    });

    expect(outcome.status).toBe("FAILED");
    expect(outcome.result.output.reason).toBe("adapter_not_registered");
  });

  it("marks execution partial when independent verification fails", async () => {
    const adapter: CapabilityAdapter = {
      capability: health.name,
      execute: async () => ({ ok: true }),
    };
    const verifier: VerificationAdapter = {
      capability: health.name,
      verify: async () => ({
        matched: false,
        evidence: ["read-back-mismatch"],
        observed: { ok: false },
      }),
    };

    const outcome = await runExecution(request(health.name, "read"), {
      capabilities: createCapabilityRegistry([health]),
      adapters: new Map([[health.name, adapter]]),
      verifiers: new Map([[health.name, verifier]]),
    });

    expect(outcome.status).toBe("PARTIAL");
    expect(outcome.verification?.matched).toBe(false);
  });
});
