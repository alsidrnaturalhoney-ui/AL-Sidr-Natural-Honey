# AL SIDR OS — Integration Registry

**Verified:** 2026-09-07

| Integration | Status | Canonical purpose | Next gate |
|---|---|---|---|
| GitHub | Connected | Engineering/source control | Reconcile remaining draft implementation PRs |
| Notion | Connected | Knowledge/governance/executive record | Keep canonical registry synchronized with verified state |
| Shopify | Connected | Live commerce/catalog/pricing/inventory | Continue catalog, analytics and sales-channel QA |
| Asana | Connected | Execution/projects/tasks | Use the canonical Unified Systems Setup & Optimization project |
| Linear | Connected | Product/engineering planning | Avoid duplicating Asana execution tracking |
| Airtable | Governed operational registry | Structured operations data | Reuse existing registry; do not create a parallel base |
| Supabase | Active + hardened | Application backend/validation/audit state | Continue migrations, RLS and advisor checks |
| n8n | Connected project; workflows inactive | Orchestration | Enable MCP inspection before publishing/activating workflows |
| Figma | Connected account | Design system/UI | Modify only an identified canonical production file |
| Adobe Acrobat | Available | Documents/PDF | Use for controlled document workflows when needed |
| Manus | Delegated execution layer | Authorized multi-step execution | Require explicit scopes, auditability and source-of-truth discipline |
| Shopify social/merchant channels | Authorization-dependent | Catalog distribution and conversion | Verify each platform connection, policy status and tracking before activation |

## Sync rules
- Notion owns knowledge and governance.
- Shopify owns live commerce facts.
- GitHub owns implementation artifacts.
- Asana owns execution status.
- Linear owns product/engineering planning rather than operational execution.
- Airtable owns structured operational registry data.
- Supabase owns application/validation data and the audit/monitoring ledger.
- n8n orchestrates approved workflows but does not become a source of truth.
- No system may silently overwrite another system's canonical data.
- Material cross-system writes must be verified after execution and recorded when practical.

## Locked operating rules
- Certification naming: **ADAFSA — Abu Dhabi Agriculture and Food Safety Authority**.
- UAE shipping: **Free UAE Delivery over AED 250 | Flat AED 20 below AED 250**.
- Customer-facing work is bilingual English/Arabic where applicable.
- Claims must be verified and product/batch-specific; no unsupported medical claims.
