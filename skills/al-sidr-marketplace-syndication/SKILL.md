---
name: al-sidr-marketplace-syndication
description: >
  Normalize and syndicate approved AL SIDR product data to marketplaces,
  delivery apps and retail channels while protecting price and claim integrity.
when-to-use: >
  Amazon, Noon, Deliveroo, Talabat, Instashop, Careem, marketplace, product feed,
  channel listing, catalog sync, retail listing
user-invocable: true
argument-hint: "[channel, product set, feed, or listing issue]"
metadata:
  owner-agent: shopify-operator
  version: "1.0.0"
  status: production
---

# AL SIDR Marketplace Syndication

Shopify/current product master is the commerce authority unless an approved
channel-specific contract requires an override.

## Procedure
1. Resolve canonical SKU/variant and current product facts.
2. Map each channel field: title, Arabic title where supported, SKU/GTIN, size,
   price authority, inventory source, category, images, description and attributes.
3. Sanitize claims through AL SIDR claims compliance before export.
4. Detect mismatched prices, obsolete SKUs, duplicate listings, broken images,
   missing GTINs, stale inventory and unsupported badges.
5. Preserve channel IDs and URL dependencies before replacing listings.
6. Produce a dry-run diff before write actions.
7. Publish/update only with required approval and verify the resulting listing.

## Output
- Channel and scope
- Canonical source record
- Field mapping/diff
- Errors and conflicts
- Claim/price integrity checks
- Publish plan and rollback
- VERIFIED / BLOCKED / NEXT
