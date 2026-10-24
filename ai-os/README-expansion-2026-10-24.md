# AL SIDR AI OS — Governed Expansion Pack (2026-10-24)

**Status:** REVIEW PACKAGE — NOT INSTALLED AS A CHATGPT PLUGIN, NOT A RUNNING AGENT, NOT DEPLOYED. Public-safe reusable code/config only. Existing AL SIDR AI OS remains the sole architecture.

## New components
- Three specialist skills: email-delivery investigation, Shopify checkout/release QA, and evidence/knowledge reconciliation (under root `skills/`).
- Two proposed specialist-agent contracts (under `ai-os/agents/`). These are specifications for routing by the already existing parent agents, not running services.
- One deterministic local Python tool (`ai-os/tools/quality_gates.py`) with standard-library unit tests (11 cases initially).
- One public-safe knowledge-record schema with authority/freshness/dispute rules.
- One instruction-pack extension inheriting the existing orchestrator.
- A proposed extension manifest below; entries must be integrated with canonical registries during code review.

## Run tests
From repository root: `python -m unittest discover -s ai-os/tools -p 'test_*.py' -v`.

## Status and rollout
Stage 0: locally tested definition only. Stage 1: code review and manifest registration. Stage 2: owner-approved connected-account read-only trial with anonymized samples. Stage 3: independent integration QA. Stage 4: approved production action, not automatic.

**Known boundaries:** No live Klaviyo sender repair, no Shopify publication, no Supabase restore, no email send, no GitHub merge/deploy. Public GitHub may be visible to anyone; keep sensitive business facts in private Notion and Airtable only.
