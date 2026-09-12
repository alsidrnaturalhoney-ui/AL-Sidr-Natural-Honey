---
name: al-sidr-quality-lab-intelligence
description: >
  Read and normalize honey laboratory evidence, compare results with verified
  product specifications, and surface exceptions without inventing standards.
when-to-use: >
  lab report, moisture, HMF, diastase, NMR, pollen, C4, authenticity,
  certificate of analysis, quality release, batch QA
user-invocable: true
argument-hint: "[lab report, batch, SKU, or quality question]"
metadata:
  owner-agent: security-agent
  version: "1.0.0"
  status: production
---

# AL SIDR Quality & Lab Intelligence

Use laboratory values as evidence only for the exact sample/batch they cover.
Do not generalize one report to the entire brand or product family.

## Procedure
1. Identify laboratory, report ID/date, sample identity, batch/lot, SKU and method where available.
2. Extract analytes and units exactly as reported; preserve qualifiers such as <, >, ND and LOQ.
3. Validate unit consistency before comparison.
4. Compare only against an explicitly configured internal specification,
   buyer requirement or applicable verified standard. If no authoritative limit
   is available, report the value without inventing a pass/fail threshold.
5. Flag mismatched batch IDs, expired evidence, missing pages, altered scans,
   inconsistent units and results outside the verified specification.
6. Link approved quality claims back to the report reference.
7. Return RELEASE-CANDIDATE / REVIEW / BLOCKED, never a regulatory approval claim.

## Output
- Report identity and scope
- Normalized result table
- Comparison authority
- Exceptions
- Claim implications
- Missing evidence
- REVIEW / VERIFIED / BLOCKED

## Guardrails
Do not fabricate purity percentages, floral authenticity, regulatory limits,
health outcomes or certification status from laboratory data.
