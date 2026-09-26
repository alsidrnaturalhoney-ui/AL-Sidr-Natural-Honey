# AL SIDR Prompt Library v2

Version: 2.0.0
Date: 2026-09-26
Status: governed-library
Inherits: `ai-os/prompts/master-orchestrator.md`

Use these as parameterized operating prompts. They do not override source-of-truth, approval, compliance, security or secret-handling rules.

## 1. Retail PO Execution
**Trigger:** new retailer PO/LPO or stocktake notice.
**Prompt:** Extract buyer, PO number, issue date, delivery deadline, line items, SKU/barcode, quantity, unit price, VAT, receiving rules, invoice requirements and exceptions. Cross-check against authoritative catalog facts. Produce READY / BLOCKED status, discrepancies, delivery checklist and Asana-ready actions. Never invent missing commercial fields.

## 2. Marketplace Exception Recovery
**Trigger:** Noon/Amazon failed return, unidentified product, stranded inventory or listing rejection.
**Prompt:** Identify marketplace, case/shipment/reference IDs, affected SKUs/quantity, exact failure reason, policy/deadline evidence and next permitted recovery action. Separate platform fact from inference. Draft support escalation without sending.

## 3. Payment Partner Continuity
**Trigger:** licence expiry, KYC reminder, account suspension or checkout-provider warning.
**Prompt:** Extract provider, merchant/account reference, exact deadline, required document/action and stated consequence. Verify current commerce impact where possible. Produce continuity risk, safe remediation checklist and support draft. Never upload identity/legal documents or accept terms without approval.

## 4. Finance Reconciliation
**Trigger:** merchant statement, settlement report, channel payout or fee statement.
**Prompt:** Reconcile statement period and totals to authoritative sales/order evidence. Separate gross sales, discounts, refunds, fees, tax and net settlement. Flag missing periods, mismatches and unsupported assumptions. Never initiate transfers or refunds.

## 5. Cross-System Product Truth
**Trigger:** conflicting product facts across Shopify, marketplace, docs or memory.
**Prompt:** Resolve each disputed field independently using authority order. Return field, competing values, authoritative value, evidence, freshness and required downstream corrections. Do not bulk overwrite systems.

## 6. Promotion Consistency Audit
**Trigger:** new campaign or storefront promotion discrepancy.
**Prompt:** Compare promotion code, discount, start/end date, eligibility, shipping threshold and channel copy across Shopify, content, email and marketplace surfaces. Identify expired or contradictory messages. Draft a single canonical promotion record.

## 7. Local Reputation Audit
**Trigger:** Google Business Profile or review-management pass.
**Prompt:** Audit identity, categories, hours, website, phone, products/services, recent posts, review themes and unresolved reputation risks. Draft bilingual responses only from known facts. Never fabricate customer history.

## 8. Compliance Evidence Gate
**Trigger:** product claim, certification, award, licence or lab statement.
**Prompt:** Classify each claim VERIFIED / EXPIRED / UNSUPPORTED / NEEDS-EVIDENCE. Record source, issuer, validity period and approved wording. Block medical/curative wording and ambiguous certification claims from publication.

## 9. CRO Experiment Design
**Trigger:** funnel leak or conversion problem.
**Prompt:** State observed problem, baseline metric, hypothesis, single primary metric, guardrails, test audience, minimum evidence needed, stop condition and decision rule. Do not declare a winner before data is available.

## 10. AOV Experiment Design
**Trigger:** basket-size or bundle opportunity.
**Prompt:** Use current catalog, margin constraints and inventory controls to propose testable bundle/cross-sell concepts. Exclude low-stock, campaign-ineligible or negative-margin items unless explicitly approved.

## 11. Inventory Risk Brief
**Trigger:** stock review.
**Prompt:** Identify critical/low/reorder signals using authoritative inventory plus supplier lead-time evidence when available. Separate actual stock from forecasts. Recommend actions without placing orders.

## 12. B2B Opportunity Qualification
**Trigger:** retailer, HORECA, corporate or distributor lead.
**Prompt:** Score fit from verified company/buyer facts, estimated volume evidence, category fit, geography, documentation readiness and next action. Never invent decision-maker contact details.

## 13. Procurement Fraud Review
**Trigger:** supplier-registration payment, unusual fee or sensitive document request.
**Prompt:** Verify sender/domain, payment beneficiary, official portal, fee basis, urgency pattern and independent official-channel corroboration. Output LOW / MEDIUM / HIGH risk with evidence and blocked actions.

## 14. AI Tool Gap Discovery
**Trigger:** request for more AI capability.
**Prompt:** Compare requested outcome with current agent, skill, connector and plugin registries. Reuse first. Propose a new capability only if no governed equivalent exists. Define owner, evidence, permissions, risk, approval, verification and rollback.

## 15. Credential Provisioning Plan
**Trigger:** integration needs an API key/OAuth token.
**Prompt:** Name provider, credential type, minimum scopes, environment, secret-store destination, rotation/revocation method and verification test. Never print or persist the secret value.

## 16. Weekly CEO Intelligence Brief
**Trigger:** weekly review.
**Prompt:** Summarize verified revenue, funnel, AOV, orders, inventory risks, retail deadlines, marketplace exceptions, CRM performance, compliance expiries, engineering blockers and highest-value next actions. Label stale or unavailable sources explicitly.

## 17. Arabic/English Publication QA
**Trigger:** bilingual asset ready for publication.
**Prompt:** Check meaning parity, product names, units, price/promotion consistency, claims, CTA, tone and RTL-sensitive formatting. Preserve natural Arabic rather than literal translation.

## 18. Knowledge Freshness Sweep
**Trigger:** system audit or major update.
**Prompt:** Identify mutable facts older than their domain freshness threshold. Compare against live authoritative sources, preserve historical evidence and update only the canonical current-state layer.

## 19. Duplicate-System Prevention
**Trigger:** proposal to create a new dashboard, OS, registry, agent or database.
**Prompt:** Search canonical systems first. If an equivalent exists, extend it. If not, justify the new object by unique responsibility, authority boundary and lifecycle. Never create a parallel master source.

## 20. Completion Verification
**Trigger:** before declaring work done.
**Prompt:** Verify resulting state independently. Return COMPLETED, VERIFIED, BLOCKED, RISKS and NEXT. Do not equate a successful API call with a verified business outcome.
