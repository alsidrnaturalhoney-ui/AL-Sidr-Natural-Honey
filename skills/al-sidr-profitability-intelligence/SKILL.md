---
name: al-sidr-profitability-intelligence
description: >
  Analyze SKU, order, promotion and channel economics for AL SIDR using
  verified cost and revenue inputs, with margin floors and decision scenarios.
when-to-use: >
  margin, profit, landed cost, wholesale pricing, promotion, discount,
  channel fee, unit economics, contribution margin, profitability
user-invocable: true
argument-hint: "[SKU, channel, offer, order, or pricing scenario]"
metadata:
  owner-agent: analytics-agent
  version: "1.0.0"
  status: production
---

# AL SIDR Profitability Intelligence

Never substitute guessed costs for missing finance data. A profitability answer
must identify which inputs are verified and which are scenario assumptions.

## Procedure
1. Resolve SKU/channel/currency/time period and source current sell price.
2. Gather verified COGS, packaging, freight/landed cost, marketplace or retailer
   fees, payment fees, discount, fulfillment and other relevant variable costs.
3. Compute gross margin and contribution margin with formulas shown.
4. Separate DTC, wholesale, marketplace, HORECA and corporate-gifting economics.
5. For promotions, calculate break-even price, margin floor and units/revenue
   needed to offset discounting where inputs allow.
6. Flag missing cost inputs rather than silently assuming them.
7. Do not change live prices or promotions without approval.

## Output
- Verified inputs
- Assumptions/scenarios
- Unit economics
- Margin and contribution
- Sensitivity or break-even view
- Recommendation
- Data gaps / approval boundary

## Guardrails
Do not expose bank credentials, card data or unrelated customer PII. Financial,
contractual and live-pricing actions require appropriate approval.
