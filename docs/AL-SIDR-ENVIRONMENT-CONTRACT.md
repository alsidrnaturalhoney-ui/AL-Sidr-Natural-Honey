# AL SIDR OS — Environment & Release Contract

## Environments
- `local`: developer experimentation; no production writes.
- `development`: integration and schema work.
- `staging`: release-candidate validation.
- `production`: live customer/business systems.

## Required promotion path
`local → development → staging → production`

An exception is allowed only for platform-managed configuration changes that do not expose a separate staging surface. Those changes still require pre-write inspection, a reversible plan where practical, and post-write verification.

## Release gates
1. Source/current state reviewed.
2. Tests or platform validation pass.
3. Security review passes or an explicit accepted exception is documented.
4. Database schema changes use reviewed migrations.
5. Shopify production changes are separately verified against live Admin state.
6. Bilingual customer-facing changes are checked for English/Arabic semantic consistency.
7. Claims, certifications, awards, pricing, shipping and inventory assertions are verified from their canonical source.
8. Notion canonical documentation is updated when architecture or governance changes materially.
9. Linear planning/release status is updated when applicable.
10. Asana execution tasks are closed only after evidence-based verification.
11. Material production changes are logged when practical.

## Prohibited
- Secrets in source control.
- Direct production schema edits without migration history.
- Unreviewed live theme changes.
- Duplicate customer/product master data maintained outside canonical systems.
- Blind activation of automation workflows that have not been inspected and tested.
- Autonomous destructive production actions without an explicit, auditable approval path.
- Publishing obsolete ADFCA naming, unsupported medical claims, or blanket certification/laboratory claims.

## Locked commerce rules
- Certification authority naming: **ADAFSA — Abu Dhabi Agriculture and Food Safety Authority**.
- UAE delivery: **Free UAE Delivery over AED 250 | Flat AED 20 below AED 250**.
- Shopify remains the authority for live commerce state.
