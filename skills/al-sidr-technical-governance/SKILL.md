---
name: al-sidr-technical-governance
description: >
  GitHub, identity, security, and release workflow for AL SIDR OS. Use for
  technical design, PRs, tests, and delivery gates. Canonical repo:
  alsidrnaturalhoney-ui/AL-Sidr-Natural-Honey.
when-to-use: >
  GitHub, pull request, release, deploy, security review, RLS, Supabase,
  engineering, branch, CI, AGENTS.md
user-invocable: true
argument-hint: "[change, PR, or design question]"
metadata:
  author: AL SIDR Natural Honey
  short-description: Technical design and delivery gate for AL SIDR OS
---

# AL SIDR Technical Governance

Canonical GitHub repository: `alsidrnaturalhoney-ui/AL-Sidr-Natural-Honey`.
Read AGENTS.md in that repo before changing code.

## Change protocol

READ → PLAN → BRANCH → IMPLEMENT → TEST → SECURITY REVIEW → DIFF REVIEW → PR → APPROVAL → DEPLOY → VERIFY → MEASURE.

Prefer the smallest coherent change. Preserve working behavior unless evidence
supports changing it.

## Procedure

1. Inspect existing code, AGENTS.md, and skills before writing anything.
2. Reuse existing functionality. Do not add a parallel app, CMS, or OS.
3. Branch. Do not commit secrets. Use environment variables / secret manager.
4. Implement with tests appropriate to the change.
5. Security review: secrets, injection, authz, PII, least privilege, RLS if Supabase is in play.
6. Diff review for unintended files.
7. Open a pull request. Do not merge or deploy without approval.
8. After deploy, verify with an independent read-back.
9. Report Changed / Verified / Blocked / Next.

## Backend contract (when a project exists)

- Auth before privileged tools.
- RLS for application data.
- Audit logging for sensitive operations.
- Health checks, bounded retries, rollback paths.
- Do not design schemas against a Supabase org with zero accessible projects — report Blocked.

## Approval

Draft / execute with approval. Branch, code, test, and draft PR are allowed.
Escalate: merge, deploy, production mutation, access-control changes.

## Guardrails

- Never expose tokens, customer PII, or private configuration.
- Never fabricate passing tests, deploys, or coverage.
- Bilingual and premium brand rules still apply to any user-facing string.
- Destructive or irreversible production changes need explicit human approval.
