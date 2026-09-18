import { CapabilityManifest, ExecutionRequest } from "./contracts.js";
import { CapabilityRegistry, getCapability } from "./registry.js";

export type RoutedRequest = Readonly<{
  request: ExecutionRequest;
  capability: CapabilityManifest;
}>;

export function routeRequest(
  inputRequest: ExecutionRequest,
  registry: CapabilityRegistry,
): RoutedRequest {
  const request = ExecutionRequest.parse(inputRequest);
  const capability = getCapability(registry, request.capability);

  if (!capability) {
    throw new Error(`unknown_capability:${request.capability}`);
  }

  if (!capability.allowedOperations.includes(request.operation)) {
    throw new Error(
      `operation_not_allowed:${request.capability}:${request.operation}`,
    );
  }

  return Object.freeze({ request, capability });
}
