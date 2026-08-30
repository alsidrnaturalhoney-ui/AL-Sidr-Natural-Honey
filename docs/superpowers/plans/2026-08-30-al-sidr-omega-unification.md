# AL SIDR OMEGA Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the AL SIDR JARVIS V6 architecture into a governed hybrid-authority operating system covering canonical data, capabilities, agents, skills, MCPs, connectors, prompts, projects, content, code, and platform synchronization.

**Architecture:** Establish a canonical governance layer first, then model domain-specific authorities, capabilities, risk and permissions, event/audit history, and truth/drift relationships. Platform adapters consume this contract; no platform becomes an accidental global source of truth.

**Tech Stack:** TypeScript, Zod, Supabase/PostgreSQL/pgvector, Redis, GitHub/GitHub Actions, Vercel, Shopify Admin GraphQL, MCP SDK, existing connected platform APIs, automated tests and audit logs.

**Spec:** `docs/superpowers/specs/2026-08-30-al-sidr-omega-canonical-v2-design.md`

## Global Constraints

- Hybrid authority model: each business/technical domain has one authoritative system.
- Generate → validate → diff → approve → execute is the default change lifecycle.
- Compliance and claims require deterministic rules plus governed review; LLM output alone is insufficient.
- Secrets and API keys must never be committed to source, prompts, documentation, or logs.
- Production changes require explicit permission and rollback readiness.
- No silent bidirectional overwrites between platforms.
- All contracts use strict TypeScript/Zod validation.
- Public-facing claims must be evidence-backed and pass the applicable governance gate.
- Existing AL SIDR canonical values remain unchanged unless an explicitly governed change is approved.

---

### Task 1: Canonical governance specification

**Files:**
- Create: `docs/superpowers/specs/2026-08-30-al-sidr-omega-canonical-v2-design.md`
- Create: `config/canonical-values.json`
- Create: `config/authority-registry.json`
- Create: `config/risk-policy.json`

**Interfaces:**
- Produces canonical values, authority ownership, risk levels, approval boundaries, and synchronization rules consumed by all later tasks.

- [ ] Define canonical identity, commerce, brand, compliance, SEO/content, infrastructure, and operational domains.
- [ ] Define one authoritative system per domain and read/write permissions for secondary systems.
- [ ] Define R0–R5 risk classes and required approval levels.
- [ ] Define immutable/auditable change semantics for canonical values.
- [ ] Add tests that reject duplicate authority for a domain and reject unauthorized writes.
- [ ] Commit the governance specification and configuration.

### Task 2: Capability, agent, skill, and instruction registry

**Files:**
- Create: `config/capabilities.json`
- Create: `config/agents.json`
- Create: `config/skills.json`
- Create: `config/instructions.json`
- Create: `config/prompts.json`

**Interfaces:**
- Each capability declares owner, purpose, inputs, outputs, permissions, dependencies, MCPs/connectors, risk, approval level, tests, and rollback behavior.

- [ ] Register the 10 JARVIS planes.
- [ ] Register the current 24 infrastructure-first skills.
- [ ] Register agents and their skill/capability dependencies.
- [ ] Register platform-specific prompts as adapters of the canonical contract.
- [ ] Validate registry uniqueness and dependency references with Zod.
- [ ] Commit registry artifacts and validation tests.

### Task 3: MCP and connector registry

**Files:**
- Create: `config/mcp-servers.json`
- Create: `config/connectors.json`
- Create: `packages/contracts/src/mcp.ts`
- Create: `packages/contracts/src/connectors.ts`

**Interfaces:**
- MCP and connector records expose domain, capabilities, auth requirements, webhook requirements, source of truth, risk class, and health checks.

- [ ] Register the commerce, content, compliance, analytics, and CX MCP domains.
- [ ] Register Shopify, GitHub, Postgres/vector, GCP, Klaviyo, support, WhatsApp, and other approved adapters from the latest architecture.
- [ ] Validate that every write-capable connector declares authority, permission, and rollback metadata.
- [ ] Ensure credentials are referenced by secret identifiers only.
- [ ] Add contract tests for MCP/connector registry integrity.

### Task 4: Risk, permission, and approval engine

**Files:**
- Create: `packages/governance/src/risk-engine.ts`
- Create: `packages/governance/src/permission-engine.ts`
- Create: `packages/governance/src/approval-engine.ts`
- Test: `packages/governance/src/*.test.ts`

**Interfaces:**
- `classifyAction(action): RiskDecision`
- `authorizeAction(subject, action): AuthorizationDecision`
- `requestApproval(action): ApprovalRequest`

- [ ] Write failing tests for R0–R5 decisions.
- [ ] Implement deterministic risk classification.
- [ ] Implement subject/role/capability permission checks.
- [ ] Implement explicit approval states and expiration.
- [ ] Reject production, financial, credential, and compliance-sensitive actions without the required gate.
- [ ] Run unit tests and commit.

### Task 5: Event ledger and audit trail

**Files:**
- Create: `packages/audit/src/event-ledger.ts`
- Create: `packages/audit/src/audit-event.ts`
- Create: `supabase/migrations/*_create_audit_events.sql`
- Test: `packages/audit/src/*.test.ts`

**Interfaces:**
- `appendAuditEvent(event): Promise<AuditEventRecord>`
- `queryAuditEvents(filter): Promise<AuditEventRecord[]>`

- [ ] Define immutable event schema covering actor, action, authority, input/output hashes, validation, approval, result, and rollback metadata.
- [ ] Add PostgreSQL indexes for actor, action, authority, risk, and timestamp.
- [ ] Add tests for append-only behavior and correlation IDs.
- [ ] Integrate audit events with approval and execution boundaries.
- [ ] Run migration and tests in a non-production environment.

### Task 6: Truth graph and drift engine

**Files:**
- Create: `packages/truth-graph/src/entities.ts`
- Create: `packages/truth-graph/src/relationships.ts`
- Create: `packages/truth-graph/src/drift-detector.ts`
- Test: `packages/truth-graph/src/*.test.ts`

**Interfaces:**
- `registerEntity(entity): Promise<EntityRecord>`
- `linkEntity(source, target, relation): Promise<RelationshipRecord>`
- `detectDrift(domain): Promise<DriftFinding[]>`

- [ ] Model products, SKUs, prices, promotions, evidence, claims, content assets, channel listings, and deployments.
- [ ] Define authority-aware relationships.
- [ ] Detect stale replicas, conflicting values, missing dependencies, and unauthorized divergence.
- [ ] Add tests for price, promotion, product, and claim drift.
- [ ] Commit and document reconciliation behavior.

### Task 7: Cross-platform synchronization orchestrator

**Files:**
- Create: `packages/sync/src/sync-plan.ts`
- Create: `packages/sync/src/sync-executor.ts`
- Create: `packages/sync/src/reconciliation.ts`
- Test: `packages/sync/src/*.test.ts`

**Interfaces:**
- `planSync(change): Promise<SyncPlan>`
- `executeSync(plan): Promise<SyncResult>`
- `reconcile(domain): Promise<ReconciliationResult>`

- [ ] Implement READ → VALIDATE → AUTHORIZE → WRITE → VERIFY → AUDIT.
- [ ] Prevent loops and duplicate events with idempotency keys.
- [ ] Block secondary systems from becoming authorities.
- [ ] Implement dry-run mode before live execution.
- [ ] Add rollback metadata for every write operation.
- [ ] Test cross-platform conflict scenarios.

### Task 8: AI model and prompt routing layer

**Files:**
- Create: `packages/intelligence/src/model-router.ts`
- Create: `packages/intelligence/src/prompt-router.ts`
- Test: `packages/intelligence/src/*.test.ts`

**Interfaces:**
- `routeModel(task): ModelRoute`
- `routePrompt(task): PromptRoute`

- [ ] Route by task complexity, cost, latency, modality, and risk.
- [ ] Keep platform prompts as adapters rather than independent canonical stores.
- [ ] Require governed validation for compliance-sensitive model output.
- [ ] Add deterministic fallback behavior and error envelopes.
- [ ] Test routing and failure cases.

### Task 9: CEO/control dashboard contracts

**Files:**
- Create: `packages/control/src/dashboard-metrics.ts`
- Create: `packages/control/src/system-health.ts`
- Test: `packages/control/src/*.test.ts`

**Interfaces:**
- `getBusinessMetrics(range): Promise<BusinessMetrics>`
- `getSystemHealth(): Promise<SystemHealth>`
- `getGovernanceMetrics(range): Promise<GovernanceMetrics>`

- [ ] Define revenue, AOV, orders, margin, channel, SEO, AI, infrastructure, and governance metrics.
- [ ] Define health status for MCPs, connectors, queues, deployments, and drift.
- [ ] Add tests for metric aggregation contracts.

### Task 10: CI/CD and safety gates

**Files:**
- Create: `.github/workflows/jarvis-validate.yml`
- Create: `.github/workflows/jarvis-security.yml`
- Create: `scripts/validate-canonical.ts`
- Create: `scripts/scan-secrets.ts`

**Interfaces:**
- CI must fail on invalid Zod contracts, authority conflicts, secret leakage, unapproved production changes, or failing tests.

- [ ] Add canonical configuration validation.
- [ ] Add secret scanning.
- [ ] Add TypeScript/typecheck and unit tests.
- [ ] Add claim-policy scanning where applicable.
- [ ] Add dependency and security checks.
- [ ] Add staging-only deployment gate before production.

### Task 11: Platform adapter synchronization

**Files:**
- Modify: platform-specific adapter packages created by earlier tasks.
- Test: adapter-specific integration suites.

- [ ] Synchronize only domains for which the connected platform exposes authorized actions.
- [ ] Validate Shopify commerce synchronization against the commerce authority registry.
- [ ] Validate GitHub engineering synchronization against repository permissions.
- [ ] Validate Supabase data synchronization against database authority rules.
- [ ] Validate project/document/design/analytics adapters where connected tools expose the required actions.
- [ ] Record unavailable capabilities explicitly rather than simulating completion.

### Task 12: Production readiness and verification

**Files:**
- Create: `docs/operations/production-readiness.md`
- Create: `docs/operations/rollback-runbook.md`
- Create: `docs/operations/platform-sync-matrix.md`

- [ ] Run the full test suite.
- [ ] Run authority-conflict tests.
- [ ] Run drift simulations.
- [ ] Run security and secret scans.
- [ ] Run dry-run synchronization across all available connectors.
- [ ] Verify audit events for every simulated write.
- [ ] Verify rollback procedures.
- [ ] Produce a final capability/permission matrix.
- [ ] Only after all gates pass, request explicit production deployment approval.

---

## Verification Gates

1. **Canonical Gate:** one authority per domain; no conflicting canonical values.
2. **Contract Gate:** all inputs/outputs validate through strict schemas.
3. **Security Gate:** no secrets in code, prompts, logs, or repositories; least-privilege access enforced.
4. **Compliance Gate:** claims and regulated actions pass deterministic governance.
5. **Execution Gate:** dry-run, approval, verification, audit, and rollback are available before production writes.

## Definition of Done

The AL SIDR OMEGA system is considered unified only when every registered capability has a declared owner, authority, permissions, dependencies, validation contract, execution surface, audit path, and rollback strategy; connected platforms report verified synchronization status; and no component claims an action occurred without execution evidence.
