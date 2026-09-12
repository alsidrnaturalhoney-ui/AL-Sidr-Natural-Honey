---
name: al-sidr-procurement-command-center
description: >
  Govern supplier onboarding, prequalification, tenders, vendor portals,
  document readiness, deadlines, buyer follow-up and suspicious fee checks
  for AL SIDR Natural Honey.
when-to-use: >
  supplier registration, dnata, government portal, tender, EOI, RFP, vendor
  onboarding, prequalification, procurement documents, supplier fee, deposit
user-invocable: true
argument-hint: "[buyer, portal, tender, or onboarding request]"
metadata:
  owner-agent: procurement-agent
  version: "1.0.0"
  status: production
---

# AL SIDR Procurement Command Center

Use the canonical knowledge base and current primary evidence. Never rely on
an old checklist when the buyer or portal can be verified directly.

## Procedure
1. Identify buyer, portal, category, deadline, legal entity and requested action.
2. Retrieve current buyer requirements and the latest internal evidence.
3. Build a requirement matrix: REQUIRED / READY / EXPIRED / MISSING / NOT-APPLICABLE / NEEDS-VERIFICATION.
4. Run the fee-risk gate before any payment: treat deposits, registration fees,
   account-activation fees and unusual bank instructions as HIGH RISK until
   verified through the buyer's official domain, published procurement process
   or a known procurement contact.
5. Validate the standard supplier pack: trade licence, VAT/TRN, bank letter,
   food-safety/ADAFSA evidence, HACCP or applicable food-safety system, lab
   reports, ICV/SME evidence where requested, insurance and authorized-signatory
   evidence where requested.
6. Draft forms, cover emails, clarification questions and submission checklists.
7. Track deadline, owner, evidence source, validity date and next follow-up.
8. Do not submit, accept legal terms, upload sensitive banking records, or pay
   fees without the required approval.

## Output
- Buyer / portal / deadline
- Fee-risk verdict first
- Requirement matrix
- Ready files / missing files / expired files
- Ready-to-send response or clarification draft
- Submission steps
- Approval boundary
- VERIFIED / BLOCKED / NEXT

## Guardrails
- Never invent certificates, expiry dates, bank details, registration status or buyer requirements.
- Official primary evidence outranks brochures, old emails and prior AI summaries.
- Flag look-alike domains, personal payment requests, crypto/gift-card requests,
  urgent secrecy, mismatched beneficiary names and unexplained deposits.
- Consequential submissions and payments require explicit approval.
