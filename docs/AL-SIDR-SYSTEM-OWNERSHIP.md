# AL SIDR OS — System Ownership

## Principle
One source of truth per domain. Systems integrate; they do not duplicate ownership.

| System | Canonical role | Write authority |
|---|---|---|
| Notion | Executive knowledge, governance, SOPs, strategic documentation | Strategy/docs |
| Shopify | Live commerce, products, collections, orders, customer commerce state | Commerce |
| GitHub | Source code, configuration, tests, agent governance | Engineering |
| Linear | Engineering/project governance, milestones, releases | Delivery governance |
| Asana | Execution tasks and operational work | Execution |
| Airtable | Structured operational DB and registries | Operations |
| Supabase | Application backend, validation ledger, events, auth/RLS | Application/data |
| Figma | Design system, UI, brand tokens, prototypes | Design |
| Adobe Acrobat | PDF/document transformation and controlled document outputs | Documents |
| Manus | Delegated research and long-running execution | AI worker |
| Codex Security | Security audit and remediation gate | Security |
| Chronos | Scheduled Codex execution | Scheduling |
| Color Designer | Governed palette exploration and approval | Brand design |

## Change-control
1. Inspect current state before writing.
2. Prefer the canonical owner for each domain.
3. Never copy secrets, credentials, or PII into GitHub.
4. Production changes require validation and review.
5. Cross-system changes must record the source system and target system.
6. Archive or consolidate duplicates rather than creating parallel operating systems.

## AL SIDR visual tokens
- Heritage Gold: `#C9A227`
- Cream: `#F7F1E3`
- Charcoal: `#1C1C1C`
- Deep Gold: `#8A6A2F`
- Champagne: `#D9C58C`
