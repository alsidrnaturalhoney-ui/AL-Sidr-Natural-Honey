# AL SIDR Storefront P0 Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove verified shipping/promotion inconsistencies, add evidence-gated trust UX below Add to Cart, and preserve correct sale/schema behavior without risky live-theme edits.

**Architecture:** Duplicate the live Dawn theme to an unpublished QA theme, patch only the verified theme defects there, and make narrowly scoped content changes directly in Shopify only after re-reading the exact resource. Keep `config/promotions.json` as the canonical promotion registry and preserve existing native Product JSON-LD and legitimate Sale logic.

**Tech Stack:** Shopify Admin GraphQL, Dawn Liquid/JSON templates, GitHub, AL SIDR canonical JSON governance.

**Spec:** `docs/superpowers/specs/2026-08-31-storefront-p0-remediation-design.md`

## Global Constraints

- Free UAE Delivery over AED 250 | Flat AED 20 below AED 250.
- Use ADAFSA, never ADFCA.
- Never write theme files directly to the MAIN Shopify theme.
- Do not render ADAFSA Grade A or Lab Tested on a product without explicit evidence metafields.
- Do not globally disable Dawn Sale badges.
- Do not add duplicate Product JSON-LD or fabricated Review/AggregateRating schema.
- Do not publish filler blog posts to mask an unreproduced placeholder.
- Theme publication happens only after QA and checkout-rate verification.

---

### Task 1: Establish promotion source of truth

**Files:**
- Create: `config/promotions.json`

**Interfaces:**
- Consumes: `config/canonical-values.json` free-delivery threshold and promotion-source declaration.
- Produces: canonical promotion-state registry used by theme/content audits.

- [ ] **Step 1: Add canonical registry**

Create a versioned JSON document with the AED 250 shipping rule, expired SIDR15 status, and an explicit verification state for the Fruit Honey BOGO campaign.

- [ ] **Step 2: Validate JSON**

Run a JSON parser against `config/promotions.json` and verify `shipping.free_delivery_threshold_aed == 250` and `SIDR15.storefront_visible == false`.

- [ ] **Step 3: Commit**

```bash
git add config/promotions.json
git commit -m "fix: establish canonical promotion registry"
```

### Task 2: Create Shopify QA theme

**Files:**
- Shopify theme resource only; no MAIN-theme writes.

**Interfaces:**
- Consumes: live MAIN theme `gid://shopify/OnlineStoreTheme/131600416976`.
- Produces: unpublished QA theme ID for all theme patches.

- [ ] **Step 1: Duplicate MAIN Dawn theme**

Use Shopify `themeDuplicate` with name `AL SIDR P0 QA 2026-08-31`.

- [ ] **Step 2: Verify role**

Assert the duplicate is `UNPUBLISHED` before any theme file mutation.

### Task 3: Normalize announcement-bar shipping and remove expired promotion

**Files:**
- Modify in QA theme: `sections/header-group.json`
- Mirror source: `shopify/storefront-p0/sections/header-group.json`

**Interfaces:**
- Consumes: QA theme ID from Task 2 and canonical AED 250 shipping rule.
- Produces: one announcement section containing active campaign copy plus one canonical shipping message, with no expired SIDR15 message.

- [ ] **Step 1: Build header JSON**

Keep the current Fruit Honey offer announcement, change the shipping message to `FREE UAE DELIVERY OVER AED 250 | FLAT AED 20 BELOW • EST. 1986 • ADAFSA`, remove the June 22 SIDR15 block, and remove the duplicate second announcement section.

- [ ] **Step 2: Upsert only to unpublished QA theme**

Use `themeFilesUpsert` for `sections/header-group.json`.

- [ ] **Step 3: Read back and verify**

Assert the file contains `AED 250`, contains no `AED 200`, contains no `SIDR15`, and has one announcement-bar section in the section order.

### Task 4: Add evidence-gated trust row below ATC

**Files:**
- Create in QA theme: `snippets/trust-badges-adafsa.liquid`
- Modify in QA theme: `sections/main-product.liquid`
- Mirror source: `shopify/storefront-p0/snippets/trust-badges-adafsa.liquid`
- Mirror source: `shopify/storefront-p0/sections/main-product.patch.md`

**Interfaces:**
- Consumes: `product` Liquid object and optional `custom.adafsa_grade_a` / `custom.lab_tested` metafields.
- Produces: trust row directly after the `buy_buttons` render.

- [ ] **Step 1: Create snippet**

Render `EST. 1986`, `Secure checkout`, and `Free UAE delivery over AED 250` for all products. Render `ADAFSA Grade A` and `Lab tested` only when their boolean evidence metafields are true.

- [ ] **Step 2: Insert snippet after buy buttons**

In the `when 'buy_buttons'` branch of `sections/main-product.liquid`, render `trust-badges-adafsa` immediately after the existing buy-buttons render.

- [ ] **Step 3: Upsert QA theme files**

Use a single `themeFilesUpsert` mutation for the snippet and modified main-product file.

- [ ] **Step 4: Read back and verify**

Assert the trust snippet is called directly after buy-buttons and the evidence-gated labels are conditional.

### Task 5: Correct live Shipping & Delivery content only if inconsistent

**Files:**
- Shopify Page resource.

**Interfaces:**
- Consumes: freshly queried page ID/body.
- Produces: customer-facing shipping copy consistent with AED 250 while preserving unrelated page content.

- [ ] **Step 1: Re-read exact page**

Query the Shipping & Delivery page immediately before mutation.

- [ ] **Step 2: Replace only conflicting threshold text**

Replace AED 150/AED 200/AED 300 free-delivery thresholds with AED 250. Preserve all other content unless it contradicts the same canonical shipping rule.

- [ ] **Step 3: Re-read and verify**

Confirm the page contains AED 250 and no conflicting threshold remains.

### Task 6: Audit, do not blindly change, Sale badges and schema

**Files:**
- No theme mutation expected unless a concrete defect is reproduced.

**Interfaces:**
- Consumes: current product variant price/compare-at data and existing theme/schema files.
- Produces: verification evidence and a blocker list for any catalog pricing or structured-data follow-up.

- [ ] **Step 1: Inspect price/compare-at data**

Query representative/current active products and identify whether visible Sale badges correspond to real compare-at pricing.

- [ ] **Step 2: Preserve Dawn condition**

Do not modify `snippets/card-product.liquid` while it continues to require `compare_at_price > price`.

- [ ] **Step 3: Verify existing JSON-LD**

Confirm Product JSON-LD remains in `sections/main-product.liquid` and LocalBusiness markup remains on the homepage. Do not add Review schema without genuine review data.

### Task 7: QA and record implementation status

**Files:**
- Update: `docs/superpowers/plans/2026-08-31-storefront-p0-remediation.md` checkboxes/status if appropriate.
- Optional canonical status update in Notion.

**Interfaces:**
- Consumes: all task outputs.
- Produces: verified deployment-ready QA theme and exact remaining blockers.

- [ ] **Step 1: Run text regression gates**

Search QA theme target files for `AED 150`, `AED 200`, `AED 300`, `SIDR15`, and `ADFCA`. Any occurrence in customer-facing target copy fails QA.

- [ ] **Step 2: Run structural gates**

Verify trust snippet placement, evidence gates, existing Product JSON-LD, and legitimate Sale condition.

- [ ] **Step 3: Verify checkout delivery configuration**

Inspect Shopify delivery profile/rate configuration. Do not claim checkout synchronization unless the actual free-shipping condition is confirmed at AED 250.

- [ ] **Step 4: Record blockers**

If checkout rates, external Linktree copy, or app-rendered surfaces cannot be safely mutated through available connectors, record them explicitly rather than claiming completion.
