import { z } from "zod";

export const AuthorityEntry = z.object({
  domain: z.string().min(1),
  authority: z.string().min(1),
  mode: z.enum(["system_of_record", "domain_split", "projection_source", "governed_projection"]),
});

export type AuthorityEntry = z.infer<typeof AuthorityEntry>;
export type AuthorityRegistry = ReadonlyMap<string, AuthorityEntry>;

const AuthorityRegistryFile = z.object({
  version: z.string().min(1),
  domains: z.record(z.object({
    authority: z.string().min(1),
    mode: AuthorityEntry.shape.mode,
  })),
  write_policy: z.string().min(1),
  forbid_silent_bidirectional_overwrites: z.boolean(),
});

export type AuthorityRegistryFile = z.infer<typeof AuthorityRegistryFile>;

export function createAuthorityRegistry(inputs: unknown[]): AuthorityRegistry {
  const registry = new Map<string, AuthorityEntry>();
  for (const input of inputs) {
    const entry = AuthorityEntry.parse(input);
    if (registry.has(entry.domain)) {
      throw new Error(`duplicate_authority_domain:${entry.domain}`);
    }
    registry.set(entry.domain, Object.freeze({ ...entry }));
  }
  return registry;
}

export function createAuthorityRegistryFromConfig(input: unknown): AuthorityRegistry {
  const file = AuthorityRegistryFile.parse(input);
  return createAuthorityRegistry(
    Object.entries(file.domains).map(([domain, config]) => ({
      domain,
      authority: config.authority,
      mode: config.mode,
    })),
  );
}

export function resolveAuthority(
  registry: AuthorityRegistry,
  domain: string,
): AuthorityEntry {
  const entry = registry.get(domain);
  if (!entry) {
    throw new Error(`unknown_authority_domain:${domain}`);
  }
  return entry;
}

export function assertAuthority(
  registry: AuthorityRegistry,
  domain: string,
  system: string,
): AuthorityEntry {
  const entry = resolveAuthority(registry, domain);
  const authorities = entry.authority.split("_").filter(Boolean);

  if (entry.mode === "system_of_record" && entry.authority !== system) {
    throw new Error(`authority_mismatch:${domain}:${system}`);
  }
  if (entry.mode === "domain_split" && !authorities.includes(system)) {
    throw new Error(`authority_mismatch:${domain}:${system}`);
  }
  if (
    (entry.mode === "projection_source" || entry.mode === "governed_projection") &&
    entry.authority !== system
  ) {
    throw new Error(`projection_source_mismatch:${domain}:${system}`);
  }
  return entry;
}
