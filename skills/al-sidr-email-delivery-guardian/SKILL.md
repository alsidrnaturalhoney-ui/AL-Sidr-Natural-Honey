---
name: al-sidr-email-delivery-guardian
description: Diagnose notification delivery failure using aggregate reports, bounce events, authenticated sender evidence, and platform-native notifications without sending to customers.
owner: analytics-agent
risk: high
mode: read-only-diagnostic
---
# AL SIDR — Email Delivery Guardian

## Procedure
1. Confirm the user has authorized account reads. Retrieve current Klaviyo aggregate flow reports and associated bounce categories; record timezone, metric definitions and date range.
2. Use the deterministic `assess_delivery` gate in `ai-os/tools/quality_gates.py` on aggregate counts. A high bounce rate triggers investigation; it never authorizes sending or pausing flows.
3. Identify message sender domain, sender authentication, suppression, consent, transactional classification, triggers and Shopify native notification delivery. Treat unavailable permissions as `BLOCKED`, not a passing test.
4. Separate marketing and transactional traffic; never infer no Shopify customer notification from a Klaviyo-only bounce report.
5. Prepare a minimal, rollback-capable remediation and a controlled **internal-only** test; seek explicit approval before modifying live flows or customer communication.
6. Independently verify actual delivery and non-duplication after authorized change. Preserve original messages and evidence.

## Output
Provide `status`, `source and retrieval date`, `sample size`, `bounce and delivery counts`, `unknown causes`, `native notification status`, `recommended checks`, `approval gate`, `verification result`, and `rollback`.

## Guardrails
No customer email, new promotion, flow pause, sender swap, DNS edit or retry without a separately authorized action. Do not expose recipient identities, credentials, or private bounce payloads in public records. A flow marked LIVE is not proof of delivery.
