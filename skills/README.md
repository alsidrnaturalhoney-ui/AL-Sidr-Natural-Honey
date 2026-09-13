# AL SIDR Canonical Skills Pack

The `skills/` directory is the reusable business-skill layer for the governed
AL SIDR AI Operating System. Skills inherit `ai-os/prompts/master-orchestrator.md`
and must not create a parallel operating system.

## Core governance and intelligence
| Skill | Owner agent | Primary use |
|---|---|---|
| `al-sidr-os-governance` | Command Agent | OS decisions, priorities and governance |
| `al-sidr-executive-intelligence` | Command Agent | CEO briefs, KPIs and strategic decisions |
| `al-sidr-brand-orchestrator` | Command Agent | Cross-brand work routing |
| `al-sidr-knowledge-governance` | Knowledge Curator | Canonicalization, deduplication, freshness |
| `al-sidr-document-intelligence` | Knowledge Curator | Licences, certificates, forms, contracts, expiry |
| `al-sidr-product-traceability` | Knowledge Curator | SKU/batch/origin/supplier/lab/channel evidence |

## Procurement, retail and compliance
| Skill | Owner agent | Primary use |
|---|---|---|
| `al-sidr-procurement-command-center` | Procurement Agent | Vendor onboarding, tenders, fee-risk, submission packs |
| `al-sidr-retail-distribution` | Procurement Agent | Retail/B2B expansion and buyer pipeline |
| `al-sidr-claims-compliance` | Compliance & QA Agent | Evidence-gated product and marketing claims |
| `al-sidr-quality-lab-intelligence` | Compliance & QA Agent | Batch/lab normalization and verified-spec comparison |

## Commerce, customer and profitability
| Skill | Owner agent | Primary use |
|---|---|---|
| `al-sidr-shopify-growth` | Commerce Agent | Shopify catalog, CRO and merchandising |
| `al-sidr-marketplace-syndication` | Commerce Agent | Amazon/delivery-app/channel catalog integrity |
| `al-sidr-support-copilot` | Commerce Agent | Customer-support drafting |
| `al-sidr-crm-retention` | Data & Analytics Agent | Consent-aware lifecycle and repeat purchase |
| `al-sidr-profitability-intelligence` | Data & Analytics Agent | Unit economics, margins and offer floors |
| `al-sidr-analytics-anomaly` | Data & Analytics Agent | KPI anomalies and root-cause analysis |

## SEO, brand and content
| Skill | Owner agent | Primary use |
|---|---|---|
| `al-sidr-bilingual-seo` | SEO & Entity Agent | EN/AR SEO, entities and technical search |
| `al-sidr-content-engine` | Content Agent | Revenue Content OS production |
| `al-sidr-bilingual-copy` | Content Agent | Natural EN/AR adaptation |
| `al-sidr-social-growth-planner` | Content Agent | Platform and GBP content planning |
| `al-sidr-brand-guardian` | Content Agent | Brand voice and visual/copy consistency |

## Engineering, automation and connectors
| Skill | Owner agent | Primary use |
|---|---|---|
| `al-sidr-automation-architect` | Automation Agent | n8n/webhook/API workflow design and recovery |
| `al-sidr-mcp-connector-governance` | Automation Agent | MCP/connector discovery and permissions |
| `al-sidr-technical-governance` | Engineering Agent | Code, runtime, security and deployment governance |

## Skill contract
Every production skill must:
1. define when it should be used;
2. name an owner agent;
3. use current authoritative evidence;
4. state approval boundaries and guardrails;
5. never embed credentials or customer secrets;
6. verify consequential changes before reporting completion;
7. preserve bilingual and AL SIDR claim governance where applicable.

Machine-readable ownership: `ai-os/skills/skill-registry.yaml`.
