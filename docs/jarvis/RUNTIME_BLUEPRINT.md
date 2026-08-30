# AL SIDR JARVIS V6 OMEGA — Runtime Blueprint v2.0

This document is the implementation contract for the unified system. It converts the architecture into buildable layers without inventing credentials or claiming unavailable integrations.

## Layer 00 — Constitution
- canonical identity and terminology
- hybrid authority registry
- risk R0-R5
- approval policy
- claim/compliance policy
- security boundaries

## Layer 01 — Contracts
- Zod request/response envelopes
- event contracts
- authority contracts
- permission manifests
- sync contracts
- drift contracts
- error envelopes

## Layer 02 — Core Runtime
- orchestrator
- deterministic policy engine
- capability resolver
- permission gate
- model router
- retry/idempotency
- correlation and tracing

## Layer 03 — Memory
- working memory
- short-term memory
- long-term memory
- canonical memory
- vector retrieval
- evidence references

## Layer 04 — Agents
Agent classes:
- Governance Agent
- Commerce Agent
- Content Agent
- SEO/AEO Agent
- Compliance Agent
- Analytics Agent
- CX Agent
- Engineering Agent
- Creative Agent
- Hospitality/B2B Agent
- DevOps Agent
- Research Agent

Every agent requires a capability manifest and cannot exceed its permissions.

## Layer 05 — 24 Skills
1 AuditRemediation
2 PromotionsSync
3 LiquidSectionGen
4 MetafieldManager
5 ADAFSAComplianceCheck
6 FlowAutomationBuilder
7 InventoryRebalancer
8 StructuredDataInjector
9 CartDrawerArchitect
10 PricingEngine
11 KlaviyoFlowSync
12 JudgeMeReviewSync
13 MCPServerScaffolder
14 ZodContractGen
15 NextStorefrontGen
16 BigQueryETLStream
17 VertexPredictor
18 ASMRStoryboarder
19 WhatsAppBotRouter
20 CompetitorScraper
21 GitOpsOrchestrator
22 RAGKnowledgeBase
23 SpeedOptimizer
24 FullMonorepoScaffold

## Layer 06 — MCP / Connector Fabric
MCPs and connectors are registered with:
- stable ID/version
- transport
- auth mechanism
- scopes
- tools/resources
- authority domain
- risk class
- webhook contract
- rate limits
- timeout/retry policy
- audit event types

Candidate integrations include Shopify, Recharge, GitHub, filesystem, Postgres/vector, GCP, Klaviyo, WhatsApp, support systems, analytics, project systems, design/documentation systems, WebMCP, and MCP registries. Availability and permissions must be verified before activation.

## Layer 07 — Data
- Supabase/PostgreSQL relational state
- event/audit ledger
- truth graph
- sync state
- vector evidence index
- analytics warehouse adapters

## Layer 08 — Execution
- GitOps
- CI/CD
- staging
- deployment adapters
- scheduled workers
- webhook workers
- reconciliation workers
- rollback handlers

## Layer 09 — Experience
- Shopify storefront
- admin operations
- WhatsApp/CX
- WebMCP agent surfaces
- dashboards
- internal command interface

## Layer 10 — Intelligence / Learning
- model routing
- cost/latency telemetry
- outcome scoring
- prompt/version evaluation
- demand/retention forecasting
- anomaly detection
- continuous improvement proposals

## 24-skill manifest rule
Each skill must provide:
`manifest + Zod input + Zod output + handler + tests + permission manifest + evidence requirements + risk class + rollback strategy + audit events`.

## Agent manifest rule
Each agent must provide:
`mission + allowed skills + allowed tools + authority domains + risk ceiling + escalation policy + memory scope + observability fields`.

## MCP manifest rule
No MCP is considered active until authentication, scopes, health check, contract tests, and audit behavior are verified.

## API key rule
Secrets are runtime configuration only. Never commit credentials to Git, prompts, docs, vector memory, or generated source. Use the platform's secret store and least-privilege scopes.

## Build order
`CONSTITUTION -> CONTRACTS -> RUNTIME -> DATA -> AGENTS -> SKILLS -> MCPs -> EXECUTION -> EXPERIENCE -> LEARNING`

## Definition of done
A component is complete only when code, tests, schemas, permissions, observability, security checks, documentation, and verification evidence exist. A specification alone is not production deployment.
