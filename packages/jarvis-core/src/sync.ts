import { z } from "zod";

export const SyncContract = z.object({
  id: z.string().min(1),
  sourceSystem: z.string().min(1),
  targetSystem: z.string().min(1),
  authorityDomain: z.string().min(1),
  direction: z.enum(["one-way", "governed-two-way"]),
  conflictPolicy: z.enum(["authority-wins", "manual-review", "explicit-merge"]),
  mutationEnabled: z.boolean(),
});

export type SyncContract = z.infer<typeof SyncContract>;

export function assertSyncDirection(
  contractInput: unknown,
  fromSystem: string,
  toSystem: string,
): SyncContract {
  const contract = SyncContract.parse(contractInput);
  if (contract.direction === "one-way") {
    if (contract.sourceSystem !== fromSystem || contract.targetSystem !== toSystem) {
      throw new Error("sync_direction_violation:" + contract.id);
    }
  }
  if (!contract.mutationEnabled) {
    throw new Error("sync_mutation_disabled:" + contract.id);
  }
  return contract;
}
