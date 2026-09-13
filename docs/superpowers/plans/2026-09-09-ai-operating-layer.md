# AL SIDR AI Operating Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate AL SIDR's existing AI assets into one governed, secure and verifiable operating layer across GitHub, Supabase, GitBook and Asana.

**Architecture:** GitHub owns machine-readable governance and code; GitBook owns human-readable operating knowledge; Supabase owns runtime/audit state; Asana owns execution. Existing agents and skills are extended rather than recreated.

**Tech Stack:** GitHub, YAML/Markdown, Supabase PostgreSQL/RLS, TypeScript/Deno Edge Functions where justified, GitBook, Asana.

**Spec:** `docs/superpowers/specs/2026-09-09-ai-operating-layer-design.md`

## Global Constraints
- ADAFSA is the canonical authority name; never ADFCA.
- Free UAE delivery over AED 250; AED 20 below AED 250.
- No unsupported medical/curative claims.
- Preserve English/Arabic governance where applicable.
- No secrets in Git, prompts, docs, Asana or audit payloads.
- No duplicate operating systems; reconcile before creating.
- Destructive/material production actions require approval.

---

### Task 1: Secure Existing Supabase Runtime
**Produces:** Explicit least-privilege RLS policies for existing DSP tables and a clean security-advisor result for the no-policy finding.
- [ ] Inspect current tables and policies.
- [ ] Add authenticated access policies appropriate to internal runtime tables; do not add anonymous write access.
- [ ] Re-run Supabase security advisors.
- [ ] Verify existing schemas remain intact.

### Task 2: Create Runtime Registries
**Produces:** `agent_registry`, `skill_registry`, `workflow_registry`, `execution_runs`, `approval_requests`, `knowledge_refs` with RLS.
- [ ] Apply one additive migration with constraints and timestamps.
- [ ] Seed canonical agent and skill identifiers from GitHub assets without secrets.
- [ ] Re-run security and performance advisors.
- [ ] Generate TypeScript database types.

### Task 3: Consolidate Agent Registry
**Files:** Modify `ai-os/agents/agent-registry.yaml`; create focused prompt/agent documents only for missing roles.
- [ ] Map existing agents to the approved ten-role operating model.
- [ ] Add procurement and automation capabilities where missing.
- [ ] Preserve existing IDs when semantics match.
- [ ] Validate YAML structure and governance policy.

### Task 4: Consolidate Skills
**Files:** Existing `skills/*` and `ai-os/skills/*`.
- [ ] Inventory existing skill names before creating new ones.
- [ ] Map them to the approved skill domains.
- [ ] Create only missing high-value skills.
- [ ] Add a canonical skill index and ownership map.

### Task 5: Consolidate Prompt Library
**Files:** `ai-os/prompts/*`.
- [ ] Make the Universal Autonomous Execution Engine the parent protocol.
- [ ] Create concise specialist prompts that inherit governance instead of copying it.
- [ ] Add input/output contracts and approval boundaries.
- [ ] Add prompt versioning metadata.

### Task 6: Rebuild GitBook Documentation
**Produces:** AL SIDR-specific documentation replacing generic template guidance through a change request.
- [ ] Create/edit documentation pages for operating model, authority map, agents, skills, prompts, security, procurement and verification.
- [ ] Review change request content.
- [ ] Merge only after content is internally consistent and contains no secrets.

### Task 7: Reconcile Asana Execution Projects
**Produces:** One canonical master project with unique tasks retained.
- [ ] Compare incomplete tasks across both Unified Systems projects.
- [ ] Move or recreate only unique actionable work in the canonical Optimization project.
- [ ] Mark duplicate tasks obsolete/complete only when evidence supports it.
- [ ] Do not delete the duplicate project blindly; document archival recommendation.

### Task 8: Runtime Verification
**Produces:** Verified health report.
- [ ] Validate Supabase advisors and registry queries.
- [ ] Verify GitHub branch contains design, plan and consolidated assets.
- [ ] Verify GitBook published structure after merge.
- [ ] Verify Asana canonical project contains the reconciled execution queue.
- [ ] Record blockers and next highest-value work.
