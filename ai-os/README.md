# AL SIDR AI OS — Governed Business Control Plane

Version: 2.0.0  
Date: 2026-09-12

## Mission
Unify AL SIDR knowledge, skills, agents, connectors, prompts, runtime code, QA,
commerce, procurement, growth, customer intelligence and executive decisions
into one governed operating layer.

## Canonical flow
`BUSINESS INTENT → AUTHORITATIVE CONTEXT → ROUTER → AGENT → SKILL → TOOL/CONNECTOR → POLICY GATE → EXECUTION → VERIFICATION → AUDIT → LEARNING`

## Canonical assets
- `agents/agent-registry.yaml` — 10 core business agents plus specialist workers.
- `skills/skill-registry.yaml` — machine-readable ownership for the reusable skill pack.
- `capabilities/capability-matrix.yaml` — what the system is allowed and designed to do.
- `prompts/master-orchestrator.md` — parent execution protocol.
- `prompts/specialist-contracts.yaml` — concise inherited role contracts.
- `connectors/connector-registry.yaml` — provider capability and risk map; connection state must be verified at runtime.
- `knowledge-base/ingestion-policy.yaml` — evidence priority, freshness and conflict resolution.
- `runtime/registry-schema.sql` — review-only Supabase registry/RLS migration blueprint.
- `../packages/jarvis-core/src/business-routing.ts` — deterministic business-intent routing.

## Core agent team
Command; Procurement; Commerce; SEO & Entity; Content; Data & Analytics;
Automation; Engineering; Compliance & QA; Knowledge Curator.

## Business capability domains
Procurement and tender readiness; claim compliance; product traceability;
laboratory evidence; document intelligence; Shopify and marketplaces; bilingual
SEO/content; CRM/retention; profitability; analytics/anomalies; automation/MCP;
engineering; creative production; security; executive intelligence; self-healing QA.

## Design principles
- Reuse existing assets before creating duplicates.
- Retrieval and evidence precede inference.
- Live systems and current primary evidence outrank historical documents.
- Verify every external integration before activation.
- Separate read, draft, reversible write, material write and destructive action.
- Keep human approval gates for financial, legal, contractual and destructive actions.
- Never fabricate execution status, credentials, inventory, metrics, claims or permissions.
- Never store secrets, private keys, bank credentials or customer PII here.
- Preserve bilingual meaning and premium AL SIDR brand governance.

## Definition of done
A task is complete only when action is executed, success criteria are met,
resulting state is verified, regressions are checked and status/evidence are recorded.
