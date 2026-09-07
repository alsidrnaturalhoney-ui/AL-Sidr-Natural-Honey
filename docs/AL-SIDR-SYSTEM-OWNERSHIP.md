# AL SIDR OS — System Ownership

## Principle
One source of truth per domain. Systems integrate; they do not duplicate ownership.

| System | Canonical role | Write authority |
|---|---|---|
| Notion | Executive knowledge, governance, SOPs, strategic documentation | Strategy/docs |
| Shopify | Live commerce, products, collections, pricing, inventory, orders and customer commerce state | Commerce |
| GitHub | Source code, configuration, tests, agent governance and implementation documentation | Engineering |
| Asana | Projects, tasks, dependencies, owners and operational delivery status | Execution |
| Linear | Product and engineering planning, initiatives, milestones and releases | Planning/governance |
| Airtable | Structured operational DB and registries | Operations |
| Supabase | Application backend, validation ledger, events, auth/RLS and audit state | Application/data |
| n8n | Approved workflow orchestration | Automation |
| Figma | Design system, UI, brand tokens and prototypes | Design |
| Adobe Acrobat | PDF/document transformation and controlled document outputs | Documents |
| Manus | Delegated multi-step execution under explicit authorization | AI worker |

## Change control
1. Inspect current state before writing.
2. Prefer the canonical owner for each domain.
3. Never copy secrets, credentials, or customer PII into GitHub.
4. Production changes require validation and post-write verification.
5. Cross-system changes must preserve source and target ownership boundaries.
6. Archive or supersede duplicates rather than creating parallel operating systems.
7. n8n and delegated agents may orchestrate canonical systems but must not become new sources of truth.
8. Material actions should be reversible where practical and recorded in an audit trail.

## AL SIDR visual tokens
Canonical implementation source: `brand-system/design-system/tokens.css` and `brand-system/design-system/brand-manifest.json`.

- Honey: `#C88A24`
- Cream: `#FBF7EF`
- Charcoal: `#24221E`
- Sidr Green: `#3F5137`

Do not create a competing palette in governance documents. Additional tonal tokens should be consumed from the canonical design-system files.

## Locked business rules
- ADAFSA = Abu Dhabi Agriculture and Food Safety Authority; never use obsolete ADFCA naming.
- UAE delivery = free over AED 250; flat AED 20 below AED 250.
- Customer-facing work is bilingual English/Arabic where applicable.
- Claims must be verified and product/batch-specific; unsupported medical claims are prohibited.
