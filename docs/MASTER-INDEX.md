# AL SIDR OS — Master Index

## Purpose

This index is the navigation layer for the AL SIDR Natural Honey engineering, AI, brand and growth operating system. It organizes existing assets by responsibility rather than creating duplicate systems.

## 1. Governance

- `AGENTS.md` — agent governance, safety, change protocol and source-of-truth hierarchy.
- `JARVIS-OS/AL-SIDR-MASTER-COMMAND-CENTER.md` — engineering-side command center.

## 2. AI Operating System

- `ai-os/README.md` — AI OS overview.
- `ai-os/agents/agent-registry.yaml` — agent registry.
- `ai-os/capabilities/capability-matrix.yaml` — capability ownership.
- `ai-os/knowledge-base/architecture.md` — AI architecture knowledge.
- `ai-os/prompts/master-orchestrator.md` — orchestration prompt.
- `ai-os/skills/universal-ai-orchestrator.md` — universal orchestration skill.
- `ai-os/mcp/registry.yaml` — MCP registry.
- `ai-os/mcp/src/server.ts` — MCP server implementation.

## 3. Brand System

- `brand-system/README.md` — brand-system entry point.
- `brand-system/knowledge-base/brand-core.md` — brand core knowledge.
- `brand-system/design-system/brand-manifest.json` — structured brand manifest.
- `brand-system/design-system/tokens.css` — design tokens.
- `brand-system/agents/agent-roster.md` — brand agent roster.
- `brand-system/templates/` — reusable content/support templates.
- `brand-system/ideas/growth-idea-bank.md` — approved idea backlog.
- `brand-system/code/` — reusable brand implementation assets.

## 4. Content & Growth

- `content/` — content operating records.
- `docs/creative-assets.md` — creative asset inventory.
- `docs/creative-production-system.md` — production system.
- `skills/al-sidr-bilingual-copy/` — English/Arabic copy skill.
- `skills/al-sidr-social-growth-planner/` — social growth planning skill.
- `skills/al-sidr-brand-orchestrator/` — brand orchestration skill.

## 5. Customer Experience

- `skills/al-sidr-support-copilot/` — customer-support operating skill.
- Future CRM/customer data integrations must respect Shopify/connected-system source-of-truth rules.

## 6. Engineering & Automation

- `.github/workflows/ai-os-validate.yml` — current AI OS validation workflow.
- `.devcontainer/` — development environment.
- `ai-os/mcp/` — governed MCP layer.

## 7. Source-of-Truth Matrix

| Domain | Canonical owner | GitHub role |
|---|---|---|
| Live catalog/orders | Shopify | integration/configuration |
| Knowledge/governance | Notion | documentation mirror/reference |
| Execution | Asana | automation/configuration |
| Code/config | GitHub | canonical |
| Operational DB | Airtable when connected | schemas/integration |
| App DB/auth | Supabase when connected | application code/config |
| Design | Figma | implementation assets/tokens |
| Coordination | Slack | integration/context |
| Autonomous execution | Manus when authorized | skills/instructions |

## 8. Content Governance

Every customer-facing asset must be traceable to verified product/company information. Unsupported medical, purity, laboratory, origin, award or performance claims are prohibited. One canonical asset should exist per purpose.

## 9. Execution Sequence

1. Stabilize source-of-truth boundaries.
2. Complete repository documentation and validation.
3. Connect/expose required operational infrastructure.
4. Implement governed integrations.
5. Validate against live Shopify data.
6. Measure revenue, SEO, content, retention and operational KPIs.
7. Iterate without creating parallel systems.
