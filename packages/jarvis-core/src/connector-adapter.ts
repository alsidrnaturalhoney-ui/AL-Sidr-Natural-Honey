import type { CapabilityManifest, ExecutionRequest } from "./contracts.js";
import type { CapabilityAdapter, AdapterExecutionContext } from "./executor.js";
import type { ConnectorManifest } from "./manifests.js";
import { evaluateConnectorGate } from "./connector-gate.js";

export interface ConnectorClient {
  invoke(
    operation: string,
    args: Record<string, unknown>,
    metadata: {
      requestId: string;
      correlationId: string;
      target: string;
      idempotencyKey?: string;
    },
  ): Promise<Record<string, unknown>>;
}

export function createGovernedConnectorAdapter(input: {
  capability: CapabilityManifest;
  connector: ConnectorManifest;
  client: ConnectorClient;
  approvalValid?: (context: AdapterExecutionContext) => boolean;
  idempotencyKey?: (request: ExecutionRequest) => string | undefined;
}): CapabilityAdapter {
  return {
    capability: input.capability.name,
    async execute(context) {
      const write = input.capability.mode === "write";
      const gate = evaluateConnectorGate({
        connector: input.connector,
        operation: context.step.operation,
        risk: input.capability.risk,
        write,
        approvalValid: input.approvalValid?.(context) ?? false,
      });

      if (!gate.allowed) {
        throw new Error(gate.reason);
      }

      const idempotencyKey = input.idempotencyKey?.(context.request);
      const metadata = idempotencyKey
        ? {
            requestId: context.request.requestId,
            correlationId: context.request.correlationId,
            target: context.step.target,
            idempotencyKey,
          }
        : {
            requestId: context.request.requestId,
            correlationId: context.request.correlationId,
            target: context.step.target,
          };

      return input.client.invoke(
        context.step.operation,
        context.step.arguments,
        metadata,
      );
    },
  };
}
