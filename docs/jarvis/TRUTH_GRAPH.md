# JARVIS V6 — Truth Graph & Drift Protocol

The Truth Graph links canonical entities to their dependent representations across systems.

## Entity model
`Entity -> Authority -> Attributes -> Evidence -> Projections -> Dependencies`

Example dependency chain:
`Product -> Shopify SKU -> marketplace listings -> content assets -> structured data -> promotion projections -> analytics dimensions`.

## Drift states
- GREEN: projection matches canonical value and verification is current.
- AMBER: stale, incomplete, or awaiting verification.
- RED: conflicting value, failed reconciliation, or unauthorized mutation.

## Reconciliation
1. Read authoritative value.
2. Read projection.
3. Normalize and compare.
4. Create a drift event when unequal.
5. Generate remediation diff.
6. Apply only when permission and approval requirements are satisfied.
7. Verify target.
8. Record result in audit ledger.

No automatic overwrite occurs for an unresolved authority conflict.
