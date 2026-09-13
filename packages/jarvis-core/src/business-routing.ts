export type AgentId =
  | "ceo-command"
  | "procurement-agent"
  | "shopify-operator"
  | "seo-growth"
  | "content-agent"
  | "analytics-agent"
  | "mcp-governor"
  | "engineering-agent"
  | "security-agent"
  | "knowledge-engineer";

export type Route = {
  agent: AgentId;
  skills: string[];
  reason: string;
};

type Rule = Route & { patterns: RegExp[] };

const rules: Rule[] = [
  {
    agent: "procurement-agent",
    skills: ["al-sidr-procurement-command-center"],
    reason: "supplier onboarding, tender or procurement intent",
    patterns: [/supplier/i, /vendor/i, /tender/i, /procurement/i, /prequal/i, /\beoi\b/i, /\brfp\b/i, /registration fee/i, /deposit/i],
  },
  {
    agent: "security-agent",
    skills: ["al-sidr-claims-compliance", "al-sidr-quality-lab-intelligence"],
    reason: "claim, certification, quality or laboratory evidence intent",
    patterns: [/claim/i, /adafsa/i, /certificate/i, /lab report/i, /moisture/i, /\bhmf\b/i, /diastase/i, /\bnmr\b/i, /purity/i],
  },
  {
    agent: "shopify-operator",
    skills: ["al-sidr-shopify-growth", "al-sidr-marketplace-syndication"],
    reason: "commerce, catalog or channel listing intent",
    patterns: [/shopify/i, /product page/i, /collection/i, /checkout/i, /catalog/i, /amazon/i, /noon/i, /deliveroo/i, /talabat/i, /instashop/i, /careem/i],
  },
  {
    agent: "seo-growth",
    skills: ["al-sidr-bilingual-seo"],
    reason: "search, entity or structured-data intent",
    patterns: [/\bseo\b/i, /keyword/i, /schema/i, /structured data/i, /search console/i, /ranking/i, /hreflang/i, /local seo/i],
  },
  {
    agent: "content-agent",
    skills: ["al-sidr-content-engine", "al-sidr-bilingual-copy", "al-sidr-social-growth-planner"],
    reason: "content, bilingual copy or social intent",
    patterns: [/content/i, /caption/i, /reel/i, /instagram/i, /tiktok/i, /facebook/i, /google business/i, /bilingual/i, /arabic/i],
  },
  {
    agent: "analytics-agent",
    skills: ["al-sidr-analytics-anomaly", "al-sidr-crm-retention", "al-sidr-profitability-intelligence"],
    reason: "analytics, CRM, retention or unit-economics intent",
    patterns: [/analytics/i, /conversion/i, /\baov\b/i, /\broas\b/i, /margin/i, /profit/i, /klaviyo/i, /retention/i, /winback/i, /\bclv\b/i, /anomal/i],
  },
  {
    agent: "mcp-governor",
    skills: ["al-sidr-automation-architect", "al-sidr-mcp-connector-governance"],
    reason: "automation, workflow or connector intent",
    patterns: [/automation/i, /\bn8n\b/i, /webhook/i, /\bmcp\b/i, /connector/i, /integration/i, /sync/i, /cron/i],
  },
  {
    agent: "engineering-agent",
    skills: ["al-sidr-technical-governance"],
    reason: "software, GitHub, Supabase or runtime engineering intent",
    patterns: [/github/i, /supabase/i, /database/i, /typescript/i, /code/i, /deploy/i, /ci\/cd/i, /jarvis/i],
  },
  {
    agent: "knowledge-engineer",
    skills: ["al-sidr-knowledge-governance", "al-sidr-document-intelligence", "al-sidr-product-traceability"],
    reason: "knowledge, document or traceability intent",
    patterns: [/knowledge/i, /document/i, /file/i, /duplicate/i, /traceab/i, /\bsku\b/i, /\bbatch\b/i, /gtin/i, /archive/i],
  },
];

export function routeBusinessIntent(input: string): Route {
  const text = input.trim();
  for (const rule of rules) {
    if (rule.patterns.some((pattern) => pattern.test(text))) {
      return { agent: rule.agent, skills: rule.skills, reason: rule.reason };
    }
  }

  return {
    agent: "ceo-command",
    skills: ["al-sidr-os-governance", "al-sidr-executive-intelligence"],
    reason: "no specialist rule matched; route through command agent",
  };
}

export function getBusinessRoutingRules(): ReadonlyArray<Route> {
  return rules.map(({ agent, skills, reason }) => ({ agent, skills, reason }));
}
