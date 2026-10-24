---
name: al-sidr-evidence-reconciler
description: Normalize and reconcile multilingual product and business claims across live sources, approved policies, and historical documents with explicit conflict and freshness status.
owner: knowledge-engineer
risk: medium
mode: read-and-propose
---
# AL SIDR — Evidence & Knowledge Reconciler

## Procedure
1. Identify one exact entity, field, language, channel and validity period. Search the existing Notion master, Airtable registry, Drive source document and appropriate live system; do not duplicate their ownership.
2. Capture value, source URI/ID, source class, observed date, effective/expiry date and document owner. Minimize personal and customer information. Read current source when field is mutable.
3. Run `resolve_fact` for simple, scope-matched candidates; it does NOT replace legal, trademark, product-label or certificate verification.
4. If equal-authority current sources disagree, preserve both and mark CONFLICTED; if top authority is stale, mark STALE and refresh. Never let a historical draft silently override current commerce.
5. For marketing/SEO output, independently verify claims, bilingual Arabic meaning, infant warning and ADAFSA naming. Route changes to the content approval process.
6. Add a dated delta to the existing Notion master and a pointer to the original evidence. Do not overwrite the source document or invent a new canonical database.

## Output
`entity`, `field`, `scope`, `candidate facts`, `canonical value or null`, `status`, `rationale`, `owner`, `evidence URI`, `observed_at`, `review_due`, `proposed next action`.

## Guardrails
No medical/curative claims; no unsupported origin, certification, numerical lab threshold, award, retailer, or product-stock assertions. Prevent secret/PII ingestion. Do not merge records by fuzzy name alone.
