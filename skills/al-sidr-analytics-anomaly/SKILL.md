---
name: al-sidr-analytics-anomaly
description: >
  Detect and explain material AL SIDR anomalies across commerce, marketing,
  SEO, CRM, inventory and retail pipelines using source-aware baselines.
when-to-use: >
  KPI, anomaly, dashboard, revenue drop, conversion, AOV, ROAS, traffic,
  ranking, inventory, retail pipeline, alert, experiment
user-invocable: true
argument-hint: "[metric, channel, period, or anomaly]"
metadata:
  owner-agent: analytics-agent
  version: "1.0.0"
  status: production
---

# AL SIDR Analytics & Anomaly Intelligence

An alert must explain evidence, magnitude and likely business impact; do not
turn normal variance into noise.

## Procedure
1. Resolve metric definition, source system, timezone, currency and comparison window.
2. Check data completeness and tracking health before interpreting movement.
3. Compare with an appropriate baseline: prior period, weekday-normalized,
   campaign baseline, rolling median or explicit target.
4. Quantify absolute and percentage change and confidence/data limitations.
5. Decompose likely drivers across traffic, conversion, AOV, product mix,
   inventory, discounts, channel fees, CRM, SEO and retail pipeline where data exists.
6. Distinguish correlation from cause; propose the cheapest verification test first.
7. Rank alerts P0-P3 by financial/customer/brand/operational impact.
8. Record post-mortem learnings after resolution.

## Output
- Metric/source/window
- Data-quality verdict
- Anomaly magnitude
- Driver hypotheses with evidence
- Business impact
- Recommended verification/action
- Priority and owner
- VERIFIED / MONITOR / BLOCKED
