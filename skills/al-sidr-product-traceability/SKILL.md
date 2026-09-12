---
name: al-sidr-product-traceability
description: >
  Maintain SKU-to-origin, supplier, batch, lab, certification, GTIN, media and
  commerce-channel traceability for AL SIDR products.
when-to-use: >
  SKU, batch, origin, supplier, traceability, GTIN, barcode, lab report,
  certification, product master, catalog normalization
user-invocable: true
argument-hint: "[SKU, product family, batch, or catalog scope]"
metadata:
  owner-agent: knowledge-engineer
  version: "1.0.0"
  status: production
---

# AL SIDR Product Traceability

A product record is publishable only when mutable facts are current and the
source of each material fact is known.

## Canonical record
Capture where available: product_id, sku, variant, GTIN/barcode, EN/AR names,
product family, floral source, country/region of origin, supplier, batch/lot,
harvest or receipt date, pack size, current price authority, inventory authority,
lab-report reference, certification reference, claim status, media assets,
Shopify ID/handle, retailer-channel IDs, freshness date and evidence links.

## Procedure
1. Match identities across Shopify, supplier documents, lab reports and channel listings.
2. Never merge products only because names are similar; require stable identifiers or evidence.
3. Resolve conflicts using source priority: current primary evidence, live systems,
   approved master knowledge, corroborated external source, historical material.
4. Mark each mutable field CURRENT / STALE / CONFLICTED / MISSING.
5. Produce channel-safe product facts and a remediation queue.
6. Do not overwrite current catalog data from historical documents.

## Output
- Canonical product/variant identity
- Traceability chain
- Evidence map
- Conflicts and stale fields
- Missing evidence
- Channel sync recommendation
- VERIFIED / BLOCKED / NEXT
