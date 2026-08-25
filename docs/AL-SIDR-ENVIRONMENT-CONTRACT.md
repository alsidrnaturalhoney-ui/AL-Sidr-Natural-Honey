# AL SIDR OS — Environment & Release Contract

## Environments
- `local`: developer experimentation; no production writes.
- `development`: integration and schema work.
- `staging`: release candidate validation.
- `production`: live customer/business systems.

## Required promotion path
`local → development → staging → production`

## Release gates
1. Source reviewed.
2. Tests/validation pass.
3. Security scan pass or accepted exception.
4. Data migrations reviewed.
5. Shopify production changes separately verified.
6. Notion canonical docs updated when architecture changes.
7. Linear issue/release status updated.
8. Asana execution task closed only after verification.

## Prohibited
- Secrets in source control.
- Direct production schema edits without migration history.
- Unreviewed live theme changes.
- Duplicate customer/product master data maintained outside canonical systems.
