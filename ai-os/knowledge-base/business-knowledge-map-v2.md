# AL SIDR Business Knowledge Map v2

Date: 2026-09-26

## Canonical knowledge domains

### 1. Corporate identity & heritage
Legal/trading identity, ownership-authorized facts, Abu Dhabi heritage, Since 1986, brand story, approved contact and social identities.

### 2. Product master
SKU, title EN/AR, family, origin, weight, barcode, ingredients, price, status, inventory, collections, usage/storage, campaign eligibility and evidence links. Shopify is authoritative for live mutable commerce fields.

### 3. Quality, food safety & claims
ADAFSA naming, lab evidence, certifications, infant disclaimer, claim whitelist/blacklist, certificate validity and evidence provenance.

### 4. Commerce & checkout
Shopify theme state, shipping rules, payment partners, discounts, checkout funnel, conversion, AOV, cart rules, reviews and trust elements.

### 5. Marketplace operations
Noon, Amazon UAE and delivery-channel catalog mappings, listing requirements, returns, failed fulfilment, settlement and exception references.

### 6. Retail distribution
Retailer master, supplier codes, store/location coverage, PO/LPO rules, receiving windows, merchandising requests, stocktakes, invoices and SOA requirements.

### 7. B2B / HORECA / procurement
Lead/account records, supplier-registration requirements, proposals, tender evidence, document readiness, fraud indicators and approval state.

### 8. CRM & retention
Klaviyo lists, segments, flows, consent, send governance, lifecycle states, replenishment assumptions and retention metrics.

### 9. SEO / AEO / local presence
Search Console/GA4 evidence, canonical URLs, English/Arabic metadata, hreflang, structured data, local profiles, review themes and entity signals.

### 10. Content & creative
Approved campaigns, bilingual copy, visual system, assets, videos, prompt-derived briefs, rights/provenance and publication state.

### 11. Finance & settlements
Orders, gross/net sales, discounts, refunds, payment/marketplace statements, fees, tax, reconciliation evidence and exceptions. No banking credentials belong here.

### 12. AI / automation / engineering
Agents, skills, prompts, capabilities, connectors, MCP profiles, API credential requirements, workflows, tests, CI, security and deployment evidence.

## Freshness classes
- Live: stock, price, orders, checkout, account status, deadlines — refresh at use.
- Daily: marketplace exceptions, retailer POs, critical inventory, payment-partner alerts.
- Weekly: funnel metrics, CRM performance, content performance, local reputation.
- Monthly/expiry-driven: certificates, licences, supplier registrations, policy evidence.
- Stable-until-changed: heritage, approved brand voice, governance architecture.

## Knowledge-state labels
VERIFIED · CURRENT · STALE · CONFLICTED · DRAFT · BLOCKED · EXPIRED · ARCHIVED

## Ingestion rule
Preserve originals. Extract structured facts with provenance. Resolve mutable conflicts by authority + recency. Never replace source evidence with a generated summary.
