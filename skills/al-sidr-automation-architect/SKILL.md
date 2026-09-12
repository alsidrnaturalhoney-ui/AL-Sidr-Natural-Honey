---
name: al-sidr-automation-architect
description: >
  Design and govern AL SIDR automations across n8n, webhooks, APIs, MCP tools
  and approved SaaS systems with retries, idempotency, audit and approval gates.
when-to-use: >
  n8n, automation, webhook, API, MCP, scheduled workflow, integration,
  sync, retry, cron, orchestration, connector health
user-invocable: true
argument-hint: "[workflow, trigger, systems, or automation problem]"
metadata:
  owner-agent: mcp-governor
  version: "1.0.0"
  status: production
---

# AL SIDR Automation Architect

Automate repeatable work; do not automate uncertainty or high-risk approvals.

## Procedure
1. Define trigger, business outcome, source system, target system and owner.
2. Inspect existing workflows before creating a new one; merge overlapping logic.
3. Define canonical IDs, idempotency key, state transitions and deduplication rule.
4. Separate READ, DRAFT, REVERSIBLE-WRITE, MATERIAL-WRITE and DESTRUCTIVE actions.
5. Add least-privilege credentials by secret reference only; never place secret
   values in workflow exports, prompts, Git, logs or task systems.
6. Add timeout, bounded retry/backoff, dead-letter/manual review and alerting.
7. Require explicit approval for financial, legal, production, deletion, account,
   credential, bulk customer or materially risky actions.
8. Verify the destination state after every consequential write.
9. Log correlation ID, execution status, evidence and rollback reference.

## Output
- Workflow contract
- Trigger and systems
- Data mapping
- Risk/approval matrix
- Failure and retry behavior
- Verification/rollback
- Deployment plan
- READY / BLOCKED / NEXT
