---
name: al-sidr-document-intelligence
description: >
  Classify, extract, validate and lifecycle-manage AL SIDR business documents
  such as licences, certificates, lab reports, contracts and supplier forms.
when-to-use: >
  document pack, certificate, trade licence, VAT, bank letter, contract,
  lab report, expiry, supplier form, PDF, procurement attachment
user-invocable: true
argument-hint: "[document, folder, buyer pack, or expiry audit]"
metadata:
  owner-agent: knowledge-engineer
  version: "1.0.0"
  status: production
---

# AL SIDR Document Intelligence

Documents are evidence, not decoration. Preserve originals and provenance.

## Procedure
1. Identify document type, issuer, legal entity, issue date, expiry/validity,
   document ID only when operationally necessary, and related product/buyer.
2. Classify sensitivity before storage or reuse: PUBLIC / INTERNAL / CONFIDENTIAL / RESTRICTED.
3. Extract only fields needed for the task; never copy secrets, card data,
   passwords or private credentials into prompts, Git, tasks or knowledge files.
4. Detect missing pages, inconsistent names, expired documents, unsigned forms,
   unstamped letters where required, and conflicting versions.
5. Link the canonical original rather than proliferating duplicate copies.
6. Create expiry/reminder metadata for time-sensitive evidence.
7. For procurement packs, map every document to the exact buyer requirement.

## Output
- Document inventory
- Validity/sensitivity
- Extracted operational fields
- Defects/conflicts
- Buyer/product links
- Renewal or remediation actions
- READY / REVIEW / BLOCKED
