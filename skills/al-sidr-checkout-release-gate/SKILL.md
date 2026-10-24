---
name: al-sidr-checkout-release-gate
description: Review bilingual mobile-first Shopify staging releases against shipping, discounts, customer notifications, backup, and production approval gates.
owner: shopify-operator
risk: high
mode: staging-qa
---
# AL SIDR — Checkout & Release Gate

## Procedure
1. Identify exact Shopify store, current MAIN theme, unpublished candidate, base commit/theme ID and rollback backup. Do not create a parallel theme unless required.
2. Compare staging with live without publishing; inspect key Liquid templates, translation sections and shipping/promotion claims in EN and AR.
3. Test mobile and desktop rendered pages for accessibility, cart state and primary product-to-checkout flow. Validate cart values at AED 249, AED 250 and AED 251 **without charging**; UAE shipping baseline must match active Shopify rates, not merely text. Review GCC profiles separately.
4. Verify actual native and third-party confirmation emails, and identify duplicate notifications. Use `check_release` gate with all six mandatory checks. Any missing, unknown or failed check returns NOT_READY.
5. Seek separate publication approval. Publish only through an approved production release process; verify result from both platform state and customer-visible storefront, and keep rollback ready.

## Output
Matrix for `backup_verified`, `en_visual_qa`, `ar_visual_qa`, `checkout_threshold_qa`, `notifications_tested`, `owner_approval`, each with evidence URL and timestamp. Show READY_FOR_MANUAL_RELEASE only if all pass.

## Guardrails
Never publish a theme, alter pricing/payment/shipping, place a charged order, fabricate QA screenshots, or claim conversion uplift based on a simulated test. `check_release` never publishes anything.
