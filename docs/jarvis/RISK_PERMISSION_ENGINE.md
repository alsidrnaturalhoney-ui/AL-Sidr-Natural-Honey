# JARVIS V6 — Risk & Permission Engine

## Decision contract
Every action resolves: actor, capability, authority, risk, permissions, evidence, dependencies, approval, rollback, and audit event.

## Risk matrix
| Risk | Typical action | Default execution |
|---|---|---|
| R0 | Read/report | Autonomous |
| R1 | Draft/generate | Autonomous |
| R2 | Low-impact content/config | Policy-gated |
| R3 | Product/price/promotion/inventory/customer impact | Explicit approval |
| R4 | Production/deployment/security/credentials | Explicit approval |
| R5 | Legal/regulatory/financial authority/irreversible | Human-controlled |

## Deny conditions
- Missing authority
- Missing capability
- Missing permission
- Missing required evidence
- Failed compliance gate
- Failed security gate
- Unresolved dependency
- Missing rollback for high-risk mutation
- Non-idempotent mutation without an idempotency strategy

## Result states
ALLOW, REVIEW, BLOCK.

AI reasoning cannot elevate an action above its declared permission. Human approval cannot be inferred from conversation context unless an explicit approval event exists.
