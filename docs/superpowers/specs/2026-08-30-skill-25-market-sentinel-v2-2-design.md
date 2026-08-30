# Skill-25 MarketSentinelEngine v2.2 Design

## Goal
Harden AL SIDR Skill-25 into a production-grade competitive-intelligence subsystem with defensible evidence provenance, precise price comparisons, idempotent telemetry, and controlled integrations across Shopify, Supabase, GitHub, documentation, operations, MCP, and knowledge-graph layers.

## Scope
This phase establishes the canonical Skill-25 contracts and integration boundaries. It does not permit automatic public-facing competitor claims, automatic Shopify price/catalog mutation, or unsupported regulatory/quality assertions.

## Architecture
Market observations enter through approved capture sources, are normalized to AED/100g, linked to provenance, evaluated against the Al Sidr benchmark, and classified by evidence status. Comparison signals are persisted append-only to Supabase and BigQuery with deterministic idempotency keys. Operational and knowledge integrations consume the resulting signals through explicit interfaces.

## Evidence model
Every observation must distinguish:
- VERIFIED: supported by an approved primary source or validated laboratory/document evidence.
- DISCLOSED: explicitly stated by the competitor/source but not independently verified.
- UNKNOWN: not disclosed or unavailable.
- CONFLICT: multiple sources disagree.

Al Sidr laboratory/regulatory evidence is never copied into competitor evidence. Competitor-specific NMR, diastase, HMF, IRMS, moisture, heating, and certification fields require competitor-specific provenance.

## Benchmark
The canonical benchmark is the approved Al Sidr Royal Yemeni Doani Sidr product handle `/royal-yemeni-sidr-honey-doan`. The implementation may use the supplied benchmark defaults only when those values are already approved in repository/business source-of-truth data. Benchmark evidence must remain separate from competitor evidence.

## Pricing semantics
`pricePer100g = priceAED / packageSizeGrams * 100`.

`pricePremiumPercent = ((alSidrPricePer100g - competitorPricePer100g) / competitorPricePer100g) * 100`.

Heated products receive a separate `heatedPriceVariancePercent` relative to the Al Sidr benchmark. A negative value means the heated competitor is cheaper than the benchmark. The system must not call this a product-quality deficit unless evidence supports a quality comparison.

## Moisture semantics
A disclosed moisture value is compared numerically with the approved benchmark threshold. Undisclosed moisture remains `UNKNOWN`; it must never be rendered as a numeric value or implied compliance/non-compliance.

## Provenance
A captured observation carries source URL or source identifier, source type, captured timestamp, observation hash, and evidence status. Browser/audio/video capture integrations feed evidence records; transcription output is treated as a derived artifact and must retain a link to its source capture.

## Persistence
Supabase is the operational ledger for command history and evidence metadata. BigQuery is the analytical store for sentinel runs and normalized observations. Writes use deterministic event keys and upsert/merge semantics so repeated ingestion cannot create duplicate logical events.

## Failure behavior
A run is `SUCCESS` only when required computation succeeds and all mandatory persistence paths succeed. A run is `PARTIAL` when computation succeeds but an optional or recoverable integration fails. A run is `FAILED` when input validation or core computation fails. Every integration failure is structured with runId, subsystem, error type, retry count, and timestamp.

## Integrations
- Shopify: read-only benchmark/catalog context.
- Browser Recorder: source capture and provenance.
- AccurateScribe: transcription of approved audio/video evidence.
- Supabase: operational ledger and evidence metadata.
- GitHub: code, configuration, CI, and review workflow.
- CodeRabbit: review/security quality gate.
- GitBook and Notion: technical and operating documentation consumers.
- Asana: action/task consumer for approved intelligence signals.
- Airtable: operational registry consumer.
- WebMCP / MCP Apps: controlled agent interface.
- Ace Knowledge Graph / hgraph: relationships among brands, products, observations, evidence, and signals.
- Plugin orchestration: coordination only; it does not bypass evidence or approval gates.

## Security
No secrets, tokens, credentials, customer PII, or private configuration are committed. External integrations use environment-managed credentials. MarketSentinel has no permission to mutate Shopify prices/products. Public content generation requires an explicit downstream approval gate.

## Testing
Unit tests cover normalization, pricing semantics, moisture handling, evidence classification, idempotency keys, summary calculations, and partial-failure status. Integration tests cover persistence adapters with mocks/fixtures. CI must run type checking, tests, linting where configured, and security checks before PR approval.

## Acceptance criteria
1. Existing Skill-25 behavior remains backward-compatible where semantics are unchanged.
2. `markupPercent` is replaced or deprecated in favor of `pricePremiumPercent`.
3. Competitor evidence cannot inherit Al Sidr lab claims.
4. Undisclosed moisture remains unknown.
5. BigQuery/Supabase writes are idempotent.
6. Partial subsystem failure produces `PARTIAL` rather than false `SUCCESS`.
7. Audit events contain deterministic run/event identifiers and evidence provenance.
8. Shopify remains read-only.
9. All repository changes are reviewable through a branch and PR.
10. No unsupported public-facing competitor or regulatory claims are generated automatically.
