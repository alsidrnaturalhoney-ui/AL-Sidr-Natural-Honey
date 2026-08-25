# AL SIDR OS — System Architecture

## North Star

Build one governed operating system for revenue, brand, commerce, content, customer experience, retail, AI and engineering while preserving clear ownership of every data domain.

## Core Flow

Customer → Instagram / Website / Retail → Shopify → CRM → Automation → WhatsApp / Email → Analytics → CEO Command Center

## Source-of-Truth Boundaries

### Shopify
Live commerce truth: products, variants, catalog state, orders, customers where applicable, pricing, inventory and store operations.

### Notion
Canonical knowledge, governance, executive decisions, policies, strategy and documentation.

### Asana
Execution truth: projects, tasks, dependencies, owners and delivery status.

### GitHub
Engineering truth: code, configuration, AI skills, prompts, schemas, workflows and implementation documentation.

### Airtable
Operational database truth only when the connected Airtable workspace is actually exposed and authorized.

### Supabase
Application database/auth/infrastructure truth only for connected applications and after the project is exposed and authorized.

### Figma
Canonical design source for visual system and UI decisions.

### Slack
Coordination channel. Important decisions must be promoted to the canonical knowledge layer rather than living only in chat.

### Manus
Delegated execution layer when authorization is active. It must not become an ungoverned source of truth.

## AI / JARVIS Loop

**Understand → Verify → Think → Prioritize → Execute → Check → Optimize → Report**

The AI layer must:

- read canonical data before acting;
- verify claims before publishing;
- reuse existing capabilities;
- respect system ownership boundaries;
- log material decisions;
- validate outputs before deployment;
- avoid autonomous destructive actions.

## Revenue Content OS

### Product Page Engine
Product facts → positioning → SEO → trust → conversion → reorder.

### 15-Second Viral Engine
Hook → proof/story → product relevance → CTA → repurposing → measurement.

### UAE SEO Intelligence Engine
Search intent → bilingual keyword map → content → technical SEO → local authority → measurement.

### 45/52/60-Day Retention Engine
Purchase signal → education → usage reminder → reorder trigger → loyalty → measurement. Timing must be calibrated against real customer data rather than assumptions.

### Linktree Conversion Engine
Profile intent → focused landing experience → product/collection CTA → tracked click → Shopify conversion.

## Data Rules

1. Live source beats cached assumptions.
2. Verified company documents beat model knowledge.
3. Product catalog facts beat marketing copy.
4. Claims must be traceable.
5. No customer PII in public repository files.
6. Secrets belong in platform secret stores, never Git.
7. Schemas and automation should be version controlled when appropriate.

## Deployment Rule

Material changes follow:

**Plan → Implement → Test → Security Review → Diff Review → PR → Approval → Deploy → Verify → Measure**

Production changes must be reversible where practical and must not be made simply to satisfy a checklist.
