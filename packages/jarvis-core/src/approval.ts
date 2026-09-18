import { z } from "zod";

export const ApprovalGrant = z.object({
  approvalReference: z.string().min(1),
  requestId: z.string().min(1),
  stepId: z.string().min(1),
  approverId: z.string().min(1),
  decision: z.enum(["APPROVED", "REJECTED", "REVOKED"]),
  approvedAt: z.string().datetime(),
  expiresAt: z.string().datetime().nullable(),
});

export type ApprovalGrant = z.infer<typeof ApprovalGrant>;

export function isApprovalValid(
  input: unknown,
  expected: { requestId: string; stepId: string },
  now = new Date(),
): boolean {
  const grant = ApprovalGrant.parse(input);
  if (grant.decision !== "APPROVED") return false;
  if (grant.requestId !== expected.requestId || grant.stepId !== expected.stepId) {
    return false;
  }
  if (grant.expiresAt && new Date(grant.expiresAt).getTime() <= now.getTime()) {
    return false;
  }
  return true;
}
