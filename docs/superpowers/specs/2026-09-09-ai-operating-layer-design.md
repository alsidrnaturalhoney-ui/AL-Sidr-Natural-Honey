# AL SIDR AI Operating Layer — Design

## Goal
Create one governed AI operating layer that reuses AL SIDR's existing repositories, skills, agents, Supabase runtime, GitBook documentation, and Asana execution system instead of creating duplicate operating systems.

## Authority Map
- GitHub `AL-Sidr-Natural-Honey`: canonical machine-readable governance, skills, prompts, agents and code.
- GitBook: human-readable knowledge, SOPs, architecture and operating instructions.
- Supabase project `AL-Sidr-Natural-Honey`: runtime state, audit logs, experiments and registries.
- Asana `AL SIDR OS — Unified Systems Setup & Optimization`: execution backlog and implementation tracking.
- Shopify: live commerce authority.

## Existing Assets to Preserve
The main repository already contains `AGENTS.md`, `ai-os/`, `skills/`, `docs/`, `config/`, `JARVIS-OS/`, and related governance assets. `ai-os/agents/agent-registry.yaml` already defines executive, knowledge, MCP, Shopify, SEO, creative, engineering, security, QA and analytics agents. These are extended rather than replaced.

## Core Agent Team
1. Command Agent — routing, prioritization and completion control.
2. Procurement Agent — supplier onboarding, tender compliance and document QA.
3. Commerce Agent — Shopify, CRO, catalog and merchandising.
4. SEO & Entity Agent — bilingual UAE search/entity growth.
5. Content Agent — Revenue Content OS and compliant bilingual production.
6. Data & Analytics Agent — KPI, anomaly and experiment intelligence.
7. Automation Agent — workflows, webhooks and integration health.
8. Engineering Agent — GitHub, Supabase, JARVIS and application systems.
9. Compliance & QA Agent — ADAFSA naming, claim governance, security and verification.
10. Knowledge Curator — canonicalization, deduplication and documentation.

## Skill Domains
Procurement prequalification; tender response; supplier-document QA; Shopify CRO; bilingual SEO; structured-data validation; claim governance; social repurposing; GBP planning; catalog normalization; analytics QA; Supabase security; automation health; backlog reconciliation; verified-completion reporting.

## Runtime Data
Preserve `dsp_runs`, `audit_logs`, and `experiments`. Add registries only where they provide runtime value: `agent_registry`, `skill_registry`, `workflow_registry`, `execution_runs`, `approval_requests`, and `knowledge_refs`.

## Security
- RLS remains enabled.
- No public write policies.
- Authenticated reads/writes are explicit and least-privilege.
- Service-role automation bypasses RLS only in trusted server-side environments.
- Destructive, financial, legal and material production actions require explicit approval.
- Secrets never enter GitBook, Asana, Git, prompts or audit payloads.

## Execution Model
`SCAN -> CONSOLIDATE -> PRIORITIZE -> EXECUTE -> TEST -> VERIFY -> FIX -> RETEST -> DOCUMENT -> REPEAT`

Status vocabulary: DISCOVERED, READY, EXECUTED, VERIFIED, COMPLETED, BLOCKED, REQUIRES_HUMAN_ACTION, OBSOLETE.

## Deduplication
The Asana project `AL SIDR OS — Unified Systems Setup & Optimization` is the canonical implementation project. The similarly named `AL SIDR OS — Unified Systems Setup` must be reconciled before archival; no blind deletion.

The repository `AL-Sidr-Natural-Honey` remains the canonical governance repository. The smaller `al-sidr-ai-commerce-os` is treated as an implementation/reference repository until unique code is reconciled.

## Definition of Done
A task is complete only when action is executed, result verified, success criteria met, regressions checked, and status recorded.
