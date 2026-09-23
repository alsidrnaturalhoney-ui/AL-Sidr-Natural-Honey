# AL SIDR Business OS Control Center V3

## Mission
Provide one governed control plane for AL SIDR commerce, AI agents, data, automation, engineering, knowledge, security and executive intelligence.

## Control Center Modules

### 1. CEO Command
P0-P4 queue, approvals, blockers, dependencies, execution status, verified completion and next-best action.

### 2. Shopify Commerce Command Center
Store health, catalog/inventory, merchandising, CRO, Markets/B2B, metafields/metaobjects, storefront/theme, Functions, webhooks and app extensions. Shopify remains the live commerce authority.

### 3. Connector Hub
Registry for Shopify, GitHub, Supabase, Quicknode and future approved connectors. Every connector records owner, capabilities, access mode, health, last verification and blockers.

### 4. AI Agent & Skill Hub
Discoverable agent/skill registry with routing, ownership, version, inputs, outputs, approval requirements and verification criteria.

### 5. Workflow Observatory
Webhook health, retries, idempotency keys, queues, scheduled jobs, dead-letter/failure handling and run history.

### 6. Knowledge Intelligence
Canonical source lookup, freshness, provenance, conflict detection, bilingual retrieval and vector search. GitHub owns machine-readable governance; human documentation stays in the knowledge layer.

### 7. Data & Analytics Center
KPI definitions, anomaly alerts, attribution, experiments, profitability, CLV and decision-ready executive summaries.

### 8. Security & Compliance Center
RLS, least privilege, secret isolation, approval gates, audit logs, ADAFSA naming, food-claim governance, regression QA and release gates.

### 9. Engineering & Release Center
Repository health, PRs, CI/CD, schema migrations, architecture reviews, tests, deployments and rollback readiness.

### 10. Experience Layer
Premium responsive admin UI using Shopify App Bridge/Polaris where embedded in Shopify; command palette, global search, notifications, accessible keyboard navigation, loading/error states and bilingual-ready interface.

## New Capabilities Added to the Architecture
- Connector capability discovery and health checks
- Shopify MCP/agentic-commerce readiness
- Admin GraphQL-first Shopify integration
- Storefront API and theme/Liquid support
- Shopify Functions and webhook orchestration
- Metafields/metaobjects registry
- B2B/Markets capability routing
- Supabase Realtime, Edge Functions, Vector, Cron and Queues routing
- Quicknode blockchain infrastructure adapter with permission-aware status
- Architecture scanning and deep-module review through CodebaseDesign
- Approval inbox and material-action gates
- Execution run history and source traceability
- Safe self-healing queue with regression verification
- Connector failure/degraded-state UX

## Capability Contract
Every capability must define:
1. `id`
2. `owner_agent`
3. `connector_or_runtime`
4. `read/write scope`
5. `approval requirement`
6. `input contract`
7. `output contract`
8. `verification method`
9. `failure/retry behavior`
10. `audit event`

## Security Defaults
- No secret values in repository, prompts, documentation or audit payloads.
- Minimum OAuth/API scopes.
- RLS on exposed Supabase tables with authorization predicates, not authentication-only policies.
- `service_role` is server-side only.
- Webhook signatures are verified before processing.
- Financial, contractual, destructive and material production actions require explicit approval.

## Current Verified Integration State — 2026-09-13
- Shopify: connected; store identified as AL SIDR NATURAL HONEY, AED, UAE, Basic plan.
- GitHub: connected; Control Center V3 registry update committed on isolated feature branch.
- Supabase: connected; security hardening remains required before broader runtime expansion.
- Quicknode: connector reachable but current credential cannot enable Tooling Access; administrator credential is required for that permission.
- MCP quickstart attachment: file extension says Markdown but uploaded bytes are a Word/ZIP package; do not use as canonical Markdown until corrected or re-exported.

## Next Build Sequence
1. Secure Supabase runtime and establish least-privilege RLS.
2. Create runtime connector/capability/execution registries.
3. Build Control Center API adapters behind deep module seams.
4. Build Shopify embedded Control Center UI with App Bridge/Polaris if repository/app structure supports it.
5. Add connector health checks and approval workflow.
6. Add Realtime run/status updates.
7. Add observability, tests and regression gates.
8. Verify end-to-end before production deployment.
