# AL SIDR ONE OS — Universal AI Intelligence Ecosystem

Status: implementation baseline, September 18, 2026.

## Mission
Build one governed intelligence and execution ecosystem for AL SIDR Natural Honey. JARVIS coordinates domain systems; it does not replace their authority.

## Canonical authority map
- Shopify: live commerce, product, inventory, order and checkout truth.
- GitHub: code, configuration, engineering contracts and release history.
- Supabase: runtime application state, validation, event/audit ledger, truth graph and sync state.
- Notion: governance, approved business knowledge and SOPs.
- Airtable: structured operational registry.
- Asana: business execution and recurring operational work.
- Linear: product/engineering planning, milestones and releases.
- Vercel: governed deployment runtime.
- Figma: approved design-system source.
- GitBook: published technical/operating documentation when explicitly assigned.
- Gmail / Calendar / Drive: communication, scheduling and working-document adapters; never hidden sources of truth.

## Runtime loop
UNDERSTAND → RESOLVE AUTHORITY → GROUND → ROUTE → PLAN → VALIDATE → CLASSIFY RISK → AUTHORIZE → EXECUTE → INDEPENDENTLY VERIFY → AUDIT → LEARN → SYNC.

## Risk classes
- R0: read, analysis, validation, simulation. May run automatically.
- R1: reversible internal write. May run with notification when required permissions/evidence exist.
- R2: consequential external/customer-facing write. Explicit confirmation and rollback are required.
- R3: security, deployment, destructive, credential, billing or high-impact change. Strong authentication, explicit approval, rollback proof and independent verification are mandatory.

## Agent hierarchy
JARVIS PRIME is the only executive router. Specialist agents are defined in `ai-os/agents/master-registry.json`. They are capability-limited workers, not autonomous authorities.

Primary domains:
1. Governance & Policy
2. Shopify Commerce
3. Marketplace Catalog
4. SEO / AEO / GEO
5. Content
6. Visual Intelligence
7. Social Commerce
8. CRM & Retention
9. Customer Concierge
10. Retail / B2B / HORECA
11. Procurement & Fraud
12. Analytics / CEO Intelligence
13. Knowledge / RAG
14. Automation
15. Engineering / Release
16. Security / Privacy / Compliance
17. Inventory / Supply
18. Opportunity Research

## Skills
The governed skill catalog lives in `ai-os/skills/master-registry.json`. Every skill declares:
- owner agent
- capability
- authority domain
- risk class
- evidence requirement
- approval policy
- rollback policy

## Connectors
The platform registry lives in `config/connectors-registry.json`.
A connector can be:
- authority
- adapter
- orchestrator
- observer

Connection status is explicit:
- verified-connected
- connected-limited
- registered-unverified
- blocked

A registered name never implies credentials or live access.

## Core code
`packages/jarvis-core` provides:
- typed execution contracts
- capability registry
- deterministic router
- deterministic planner
- risk/policy evaluation
- adapter execution
- independent verifier
- immutable audit-event construction
- typed agent/skill/connector manifests
- unified execution runtime

No production connector is allowed to bypass this path.

## Data control plane
The migration `20260918101000_jarvis_universal_runtime.sql` defines:
- agent, skill and connector projections
- execution requests
- plans and steps
- approvals
- action results
- independent verifications
- append-only audit events
- truth graph
- sync state

All runtime tables enable RLS and fail closed to browser roles by default.

## App combination model
Apps are combined through adapters and event contracts, never through silent bidirectional overwrite.

Examples:
- Shopify product changed → event → validate → update Airtable/Supabase projections → SEO/content agents consume projection.
- GitHub PR merged → CI evidence → Vercel deployment plan → explicit approval when production → verify deployment → audit.
- Notion policy changed → versioned governance event → affected skills/agents revalidate before next run.
- Asana business task and Linear engineering issue may reference one execution request/correlation ID without duplicating authority.
- Gmail/Drive evidence can support a procurement decision but cannot silently overwrite canonical procurement policy.

## Memory model
1. Session memory: current run context.
2. Working memory: short-lived task state in Supabase.
3. Canonical knowledge: approved Notion/GitBook/GitHub sources.
4. Operational memory: Airtable/Asana/Linear projections.
5. Audit memory: append-only Supabase event ledger.
6. Vector/RAG memory: retrieval index built only from approved sources with provenance and freshness metadata.

## Security invariants
- least privilege
- secrets outside source control
- managed connectors or environment variables only
- explicit source-of-truth boundaries
- no silent destructive writes
- idempotency keys for external mutations
- webhook signature/replay validation
- independent post-write verification
- immutable audit trail
- approval expiry/revocation support
- production write adapters disabled until verified and approved

## Definition of done
A capability is not considered live until:
1. schema is validated,
2. source authority is declared,
3. connector credentials/scopes are verified,
4. tests pass,
5. approval policy is enforced,
6. rollback exists when required,
7. independent verification works,
8. audit persistence works,
9. monitoring/alerts exist,
10. the capability is documented and registered.

This document is the implementation map; the registries and code are the executable contract.
