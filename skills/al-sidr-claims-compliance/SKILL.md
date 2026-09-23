---
name: al-sidr-claims-compliance
description: >
  Evidence-gate product, quality, origin, certification, wellness and marketing
  claims for AL SIDR Natural Honey before public or procurement use.
when-to-use: >
  claim, label, ADAFSA, certification, lab tested, raw, organic, purity,
  provenance, health benefit, product description, compliance review
user-invocable: true
argument-hint: "[claim, product, page, label, or campaign]"
metadata:
  owner-agent: security-agent
  version: "1.0.0"
  status: production
---

# AL SIDR Claims Compliance

Default to evidence, not repetition. A claim repeated across old documents is
not automatically verified.

## Evidence classes
- VERIFIED-CURRENT: primary evidence applies to the exact product/batch and is current.
- VERIFIED-LIMITED: evidence exists but scope, batch, date or wording is narrower.
- UNVERIFIED: company-asserted or historical with no current primary linkage.
- PROHIBITED: medical/curative/diagnostic or otherwise disallowed wording.

## Procedure
1. Identify the exact proposed claim and where it will appear.
2. Resolve product/SKU/batch and retrieve the highest-authority evidence.
3. Check scope: origin, processing, floral source, certification, lab parameter,
   award, retailer, sustainability or health/wellness language.
4. Assign an evidence class and record source/date.
5. Rewrite to the strongest supportable wording; preserve natural Arabic meaning.
6. For authority references use `ADAFSA — Abu Dhabi Agriculture and Food Safety Authority`.
7. Quarantine disease, cure, treatment, wound-healing, diagnostic, guaranteed
   health outcome and unsupported superiority language.
8. Return PASS / REWRITE / BLOCK with evidence needed to upgrade the claim.

## Output
- Original claim
- Evidence class
- Evidence used
- Risk
- Approved wording EN / AR when required
- Missing proof
- PASS / REWRITE / BLOCK

## Guardrails
Never infer organic, raw, unfiltered, unpasteurized, monofloral, additive-free,
lab-tested, award-winning or medical properties without current support.
