# Skill-25 — MarketSentinelEngine v2.2

## Purpose

MarketSentinel converts competitor price/package observations into normalized market signals while preserving provenance and separating verified Al Sidr evidence from competitor evidence.

## Canonical flow

`Browser capture → observation → provenance → normalization → benchmark comparison → evidence classification → arbitrage signal → Supabase/BigQuery telemetry → knowledge graph → operations`

## Safety boundary

- Shopify access is read-only.
- MarketSentinel does not mutate catalog prices, inventory, products, SEO, or public content.
- Competitor quality claims require competitor-specific evidence.
- Al Sidr laboratory evidence must never be represented as competitor evidence.
- Missing moisture is `UNDISCLOSED`, not an inferred value.
- Regulatory naming uses `ADAFSA`; deprecated `ADFCA` must not be introduced.
- External observations require a source URL and capture timestamp.

## Metrics

- `pricePer100g`: normalized competitor price.
- `pricePremiumPercent`: Al Sidr benchmark premium relative to competitor price.
- `heatedPriceVariancePercent`: competitor-vs-benchmark price variance.
- `heatedPriceDeficitPercent`: negative variance for heated products priced below benchmark.
- `moistureVariance`: disclosed competitor moisture minus benchmark moisture, otherwise null.

## Evidence states

`VERIFIED` = evidence hash is present and can be traced to the captured source.

`DISCLOSED` = competitor disclosure is present but has not been cryptographically verified by the evidence pipeline.

`UNKNOWN` = information is absent.

`CONFLICT` = multiple sources disagree and require review.

## Persistence contract

The storage adapter must enforce deterministic idempotency using the observation timestamp, trigger, and sorted canonical brand set. Duplicate runs must be rejected or merged without creating duplicate market observations.

## Failure contract

A successful calculation with a persistence/telemetry failure returns `PARTIAL` and records the failed subsystem. Calculation failures return `FAILED` at the orchestration layer.

## Integration adapters

- Shopify: benchmark/catalog read adapter.
- Browser Recorder: source capture adapter.
- AccurateScribe: optional audio/video transcription adapter.
- Supabase: operational evidence and command-history ledger.
- BigQuery: analytical market history.
- Knowledge graph: relationships between source, brand, product, observation, benchmark, and signal.
- Notion/GitBook: human-readable intelligence and technical documentation.
- Airtable: operational registry.
- Asana: review/action queue.
- WebMCP/MCP Apps: read-only agent-facing intelligence surface.

## Review gates

`typecheck → unit tests → security checks → diff review → CodeRabbit → PR approval → deployment → post-deployment verification`.
