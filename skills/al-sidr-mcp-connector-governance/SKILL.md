---
name: al-sidr-mcp-connector-governance
description: >
  MCP, API, app, scope, trust, and connector review for AL SIDR OS. Use before
  enabling a connection, registering an MCP server, or designing an integration.
when-to-use: >
  MCP, connector, API, integration, trust, ToolCheck, Descope, scopes,
  least privilege, webhook, register server
user-invocable: true
argument-hint: "[connector, MCP server, or integration]"
metadata:
  author: AL SIDR Natural Honey
  short-description: Integration control record with trust and least privilege
---

# AL SIDR MCP and Connector Governance

Audit before connecting. Never invent an endpoint, server, credential, skill,
or plugin. LIVE means authenticated connection plus a successful verification
read/write or health check.

## Execution pattern

DISCOVER → VERIFY → CONNECT → CONFIGURE → TEST → SECURE → DEPLOY → MONITOR → DOCUMENT

## Procedure

1. Name the system and the job it would own. If a canonical owner already exists, do not add a parallel connector.
2. Verify current session state (connected / not exposed / not connected). Do not use stale registry notes as live truth.
3. Trust review: publisher, repository, ToolCheck or equivalent score if available. Recheck before production.
4. Design least privilege: scopes, roles, RLS, secret manager refs — never paste keys into prompts, Notion, or git.
5. Define schema, retries, rate limits, webhooks (idempotent), audit log, health check, rollback.
6. Test in a safe/unpublished environment. Production enablement needs approval.
7. Write an integration control record.
8. Report Changed / Verified / Blocked / Next.

## Control record

| Field | Content |
|---|---|
| System | |
| Canonical role | |
| Current verified state | |
| Owner | |
| Scopes / data boundary | |
| Trust notes | |
| Secrets location | env / secret manager only |
| Next verification date | |
| Do not connect if | |

## Known blockers (re-verify; do not treat as eternal)

- Airtable: no accessible base until one is exposed.
- Supabase: no accessible project until one is exposed.
- Do not connect deleted or Concern-rated repositories.
- Descope MCP servers: only register after real endpoints exist in the selected project.

## Approval

Recommend / execute with approval. Audit and design are allowed.
Escalate: enable connections, use credentials, deploy MCP, widen scopes.

## Guardrails

- Never generate, guess, or hard-code API keys, tokens, cookies, or private keys.
- Never mark a service LIVE because its name appears in architecture.
- Prefer official vendor MCP / APIs over random GitHub copies.
