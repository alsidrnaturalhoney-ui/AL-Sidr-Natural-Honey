import { CapabilityManifest } from "./contracts.js";

export type CapabilityRegistry = ReadonlyMap<string, CapabilityManifest>;

export function createCapabilityRegistry(manifests: unknown[]): CapabilityRegistry {
  const registry = new Map<string, CapabilityManifest>();

  for (const input of manifests) {
    const manifest = CapabilityManifest.parse(input);
    if (registry.has(manifest.name)) {
      throw new Error(`duplicate_capability:${manifest.name}`);
    }
    registry.set(manifest.name, Object.freeze({ ...manifest }));
  }

  return registry;
}

export function getCapability(
  registry: CapabilityRegistry,
  name: string,
): CapabilityManifest | undefined {
  return registry.get(name);
}

export function listCapabilities(registry: CapabilityRegistry): CapabilityManifest[] {
  return [...registry.values()];
}
