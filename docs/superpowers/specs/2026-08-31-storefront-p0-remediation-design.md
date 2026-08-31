# AL SIDR Storefront P0 Remediation Design

**Approved:** 2026-08-31

## Goal

Remove verified storefront inconsistencies without inventing fixes for stale audit findings, while preserving production safety and keeping AL SIDR governance canonical.

## Verified baseline

1. The canonical UAE free-delivery threshold is AED 250.
2. The live Dawn header contains conflicting AED 200 and AED 250 shipping announcements and an expired SIDR15 message dated June 22.
3. The Shipping & Delivery content has also been observed with a conflicting threshold and must be re-read immediately before any production content update.
4. The current homepage template does not contain the previously reported featured-blog placeholder section; real articles already exist.
5. Dawn's product-card Sale badge is conditional on compare-at price being greater than current price; sale badges must not be globally disabled.
6. Native Product JSON-LD already exists on product pages and LocalBusiness JSON-LD already exists on the homepage. Structured-data work must improve or consolidate existing markup rather than duplicate it.
7. The default product template has no governed trust component immediately below Add to Cart.
8. Sampled current storefront copy uses ADAFSA; legacy ADFCA strings must be replaced only where an exhaustive sweep finds them.

## Architecture

### Production safety

- Never write theme files directly to the MAIN theme.
- Duplicate the current MAIN Dawn theme into an unpublished QA theme.
- Apply theme-file changes only to the unpublished QA theme.
- Production page content may be updated directly only after re-reading the exact current resource and limiting the edit to the verified inconsistent copy.
- Theme publication remains a manual post-QA action.

### Shipping governance

- Canonical customer-facing rule: **Free UAE Delivery over AED 250 | Flat AED 20 below AED 250**.
- Header announcements must contain one shipping rule, not conflicting duplicate bars.
- Remove the expired SIDR15 June 22 announcement.
- Verify checkout delivery configuration independently from marketing copy before claiming checkout synchronization.

### Promotion governance

- `config/promotions.json` is the canonical promotion registry.
- Expired promotions remain recorded with `status: expired` and `storefront_visible: false` rather than being silently forgotten.
- Promotions that have not been verified against live Shopify discount configuration are marked `verify_in_shopify`; they are not treated as confirmed offers by automation.

### Trust component

Create `snippets/trust-badges-adafsa.liquid` and render it immediately after the product buy-buttons block.

Always-safe trust signals:
- Established 1986
- Secure checkout
- Free UAE delivery over AED 250

Evidence-gated signals:
- ADAFSA Grade A only when `product.metafields.custom.adafsa_grade_a.value == true`
- Lab tested only when `product.metafields.custom.lab_tested.value == true`

This prevents unsupported certifications from appearing on unrelated products such as beauty, herbs, oils, or accessories.

### Sale badges

Do not change Dawn's Sale badge condition. Audit compare-at pricing separately. A Sale badge is valid only when the underlying variant/product compare-at price is genuinely higher than the selling price.

### Structured data

Do not add a second Product schema. Do not synthesize Review/AggregateRating markup without genuine review data. Do not promote medical/wellness FAQ claims into FAQPage schema until claim governance is satisfied. Treat the original “no JSON-LD” audit item as stale and validate/consolidate in a follow-up schema QA task.

### Blog placeholder

Make no homepage blog change unless the placeholder can be reproduced in a rendered app/page-builder surface. Do not publish filler articles merely to hide a theme placeholder.

## QA gates

Before publication:

- Header contains no AED 150/AED 200/AED 300 shipping threshold.
- Header contains no expired SIDR15 June 22 message.
- Exactly one canonical shipping statement is visible in the header.
- Trust row appears directly below Add to Cart on the default product template.
- ADAFSA/Lab Tested trust labels do not render without their evidence metafields.
- Existing legitimate Sale badges still work.
- Existing Product JSON-LD remains present and is not duplicated by this patch.
- No new ADFCA strings are introduced.
- Theme remains unpublished until visual regression and checkout-rate verification pass.
