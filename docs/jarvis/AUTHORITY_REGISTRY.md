# JARVIS V6 — Hybrid Authority Registry

| Domain | Authority | Consumers / adapters |
|---|---|---|
| Commerce products, inventory, orders | Shopify | Amazon, Noon, Deliveroo, retail adapters |
| Engineering/code | GitHub | Vercel, AppDeploy, CI/CD |
| Operational relational data | Supabase/PostgreSQL | CData and analytics consumers |
| Project execution | Asana / Linear | Notion/Airtable reporting |
| Knowledge/docs | GitBook / governed Notion | agents, RAG, prompts |
| Design | Figma | Canva and creative adapters |
| Analytics | governed warehouse / analytics layer | Amplitude, dashboards |
| Promotions | version-controlled canonical promotion configuration | Shopify/channel adapters |
| Compliance | governed compliance registry | content, commerce, CX |
| Agent/web interface | JARVIS capability registry | WebMCP and MCP adapters |

## Sync Contract

All cross-system mutations follow:

`READ -> VALIDATE -> AUTHORIZE -> WRITE -> VERIFY -> AUDIT`

Bidirectional synchronization is permitted only where an explicit conflict-resolution policy exists. Otherwise, the authority wins and the secondary system is reconciled.

## Drift States

- GREEN: synchronized and verified.
- AMBER: stale or awaiting verification.
- RED: authoritative conflict or failed reconciliation.

## Promotion Authority

Promotion definitions must originate in the canonical promotion configuration. Channel renderings are projections and must not redefine the underlying promotion semantics.
