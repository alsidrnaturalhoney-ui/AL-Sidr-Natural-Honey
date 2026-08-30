# AL SIDR JARVIS V6 OMEGA — Canonical v2 Design

## Purpose

Create one governed operating architecture for AL SIDR Natural Honey while preserving hybrid domain authority. JARVIS coordinates work; it does not replace domain systems of record.

## Authority Model

- Commerce/product/order/inventory: Shopify is authoritative for live commerce state.
- Engineering/source code: GitHub is authoritative.
- Operational relational data and governed event/memory records: Supabase is authoritative.
- Project execution: Asana/Linear are authoritative for their respective project records.
- Knowledge/documentation: governed GitBook/Notion records are authoritative within explicitly assigned knowledge domains.
- Design: Figma is authoritative for approved design artifacts.
- Analytics: the governed analytics warehouse/platform is authoritative for analytical facts.
- Promotions: the canonical promotion configuration is authoritative; channel systems are projections.
- Compliance: the governed compliance/evidence registry is authoritative for approved claims and controls.
- AI prompts, agents, skills, capabilities, and MCP metadata: version-controlled JARVIS registries are authoritative.

## Core Lifecycle

READ → VALIDATE → DIFF → AUTHORIZE → WRITE → VERIFY → AUDIT

Generation never implies execution. Production execution requires the appropriate permission and approval gate.

## Risk Model

- R0: read-only observation; autonomous.
- R1: drafts and reversible low-impact actions; autonomous with validation.
- R2: non-critical content/configuration changes; validated execution.
- R3: product, pricing, promotion, customer-impacting or material operational changes; approval required.
- R4: production, infrastructure, security, credential, deployment, or broad synchronization changes; explicit approval required.
- R5: legal, regulatory, financial authority, sensitive data access, or irreversible high-impact actions; human-controlled.

## JARVIS Planes

01 ORCHESTRATOR; 02 INTELLIGENCE; 03 MEMORY; 04 AGENTS; 05 CONTROL; 06 EXECUTION; 07 CREATIVE; 08 COMMERCE; 09 CX; 10 HOSPITALITY.

## Skill and Capability Contract

Every registered skill/capability must declare identity, owner, purpose, inputs, outputs, dependencies, required permissions, MCP/connectors, authority domain, risk, approval level, tests, observability, and rollback behavior. Runtime I/O is Zod-validated.

## MCP/Connector Contract

Every write-capable MCP or connector must declare its authority domain, allowed operations, authentication mechanism by secret reference, webhook requirements, idempotency behavior, verification method, and rollback strategy. Credentials are never stored in source or prompts.

## Compliance

Public-facing claims are evidence-backed. Deterministic rules remain the first compliance boundary; an LLM cannot self-authorize a regulated claim. Conflicts enter REVIEW/BLOCK states rather than being silently resolved.

## Cross-AI Architecture

Shopify Sidekick, ChatGPT/Claude/Kimi, Gemini/Google AI Studio, and other AI tools are execution/intelligence surfaces. They consume canonical contracts and may not silently redefine canonical values. Outputs are reconciled through validation and authority-aware synchronization.

## Security

Least privilege, secret isolation, auditability, environment separation, dependency scanning, secret scanning, and rollback are mandatory. Production access is narrower than staging/development access.

## Definition of Done

The system is unified when every capability has a declared authority, permission boundary, contract, validation path, audit path, and rollback strategy; platform synchronization is observable; drift is detectable; and the system never reports an unexecuted action as completed.
