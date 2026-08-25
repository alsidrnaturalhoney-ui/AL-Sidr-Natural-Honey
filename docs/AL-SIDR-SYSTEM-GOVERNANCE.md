# AL SIDR System Governance

## Purpose

This document is the engineering-facing contract for the AL SIDR Natural Honey operating system.

## Canonical authorities

| Domain | System | Rule |
|---|---|---|
| Knowledge & governance | Notion | Canonical policies, SOPs, executive documentation |
| Commerce | Shopify | Live catalog, storefront and commerce truth |
| Engineering | GitHub | Source code, documentation, CI/CD and release history |
| Execution | Asana | Operational tasks and recurring execution |
| Operations registry | Airtable | Cross-system registry and structured operational records |
| Application data | Supabase | Backend/application data and validation ledger |
| Product & technical planning | Linear | Product roadmap and engineering issue governance |
| Design | Figma | Approved UI/design system artifacts |
| Palette exploration | Color Designer | Palette exploration; approved values are promoted to Figma/Notion |
| Autonomous execution | Manus | Delegated workflows within explicit approval boundaries |
| Security | Codex Security | Repository security scans, validation and remediation governance |
| Scheduling | Chronos for Codex | Scheduled Codex jobs when connected |
| Documents | Adobe Acrobat | Controlled PDF creation, extraction, OCR and document workflows |

## Non-negotiable rules

1. Do not create a second source of truth when a canonical system already owns the domain.
2. Do not store secrets, API keys, passwords or unnecessary customer PII in GitHub, Notion or Airtable registries.
3. Shopify changes must be treated as production commerce changes and verified after modification.
4. Engineering changes must be reviewable through GitHub.
5. Security findings must be validated before remediation claims are made.
6. Destructive operations require explicit approval unless a governed automation explicitly permits them.
7. Approved brand tokens must originate from the controlled design workflow and remain synchronized with Figma.
8. Cross-system integrations must record source, target, direction, owner, status and validation requirements.
9. Prefer reversible changes, staged rollout and one-product/one-workflow validation before scale.

## Standard lifecycle

Discover -> Design -> Plan -> Implement -> Validate -> Review -> Release -> Monitor -> Improve

## Revenue journey

Discover -> Trust -> Click -> Purchase -> Reorder

## Operating principle

Protect the heritage. Modernize the experience. Automate what should be automated.
