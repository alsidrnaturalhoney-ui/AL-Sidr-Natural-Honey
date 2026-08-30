# AL SIDR OMEGA Global Optimization Plan

## Objective
Optimize the AL SIDR repository and connected operating architecture without creating parallel systems, weakening governance, or making destructive production changes.

## Optimization pillars

1. **Architecture**
   - Keep Shopify as commerce source of truth.
   - Keep GitHub as engineering source of truth.
   - Keep Notion/GitBook for governed knowledge and documentation.
   - Keep Supabase for application data/auth/backend workloads.
   - Keep Airtable only for designated operational registry workloads.
   - Consolidate shared contracts, errors, hashing, permissions, telemetry, and evidence primitives.

2. **Skill-25 MarketSentinel**
   - Normalize all competitor prices to AED/100g.
   - Use `pricePremiumPercent` terminology.
   - Separate competitor observations from Al Sidr verified evidence.
   - Treat undisclosed values as UNKNOWN rather than inferred.
   - Add deterministic observation/event/run identifiers.
   - Make persistence retry-safe and idempotent.
   - Return SUCCESS/PARTIAL/FAILED based on subsystem health.
   - Never automatically publish competitor allegations or unsupported quality/regulatory claims.

3. **Evidence and provenance**
   - Require source URL or approved source identifier for externally captured observations.
   - Store capture timestamp, source type, evidence hash, and evidence status.
   - Preserve VERIFIED, DISCLOSED, UNKNOWN, and CONFLICT states.
   - Never convert benchmark evidence into competitor evidence.

4. **Data and storage**
   - Batch writes where supported.
   - Prefer append-only event records.
   - Add deduplication keys and retention policies.
   - Keep raw observations immutable and derived intelligence reproducible.

5. **Reliability and observability**
   - Structured logs with runId/eventId/sourceId.
   - Explicit retry and timeout policies.
   - Failure isolation between ingestion, persistence, telemetry, and downstream actions.
   - Measure latency, failure rate, evidence completeness, duplicate rate, and anomaly volume.

6. **Security**
   - Least-privilege permissions.
   - No secrets in source control.
   - Read-only Shopify intelligence access.
   - Human approval before customer-facing commerce/content changes.
   - Security checks before merge/deploy.

7. **Testing and CI**
   - Unit tests for deterministic calculations and schemas.
   - Integration tests for persistence contracts.
   - Regression tests for evidence-state transitions.
   - Typecheck, lint, test, and security checks in CI.
   - Code review gate before merge.

8. **MCP and agent interfaces**
   - Expose typed, bounded operations only.
   - Separate observation tools from mutation tools.
   - Return provenance and confidence with every intelligence signal.
   - Require approval for irreversible or public-facing actions.

9. **Knowledge graph and documentation**
   - Model relationships among brand, product, competitor, observation, source, evidence, signal, decision, and task.
   - Link intelligence outputs to their source evidence.
   - Keep GitBook/Notion documentation synchronized from governed source material rather than duplicating business truth.

10. **Operations**
    - Convert high-confidence signals into Asana actions only after policy evaluation.
    - Maintain Airtable operational registry where explicitly designated.
    - Preserve command history as append-only audit data.

11. **Commerce and SEO safety**
    - No automatic price mutation from competitive intelligence.
    - No unsupported health, purity, certification, origin, or competitor claims.
    - Verify all customer-facing claims against approved evidence before publication.

## Execution order

UNDERSTAND → INVENTORY → CONSOLIDATE → IMPLEMENT → TEST → SECURITY REVIEW → DIFF REVIEW → PR → APPROVAL → DEPLOY → VERIFY → MEASURE.

## Definition of done

- No duplicated canonical systems introduced.
- All modified code has tests appropriate to risk.
- Typecheck/lint/test/security checks are green in CI.
- Skill-25 evidence and telemetry contracts are deterministic and auditable.
- Connected integrations respect least privilege and approval gates.
- Documentation reflects the implemented contracts.
- Production changes are separately approved and verified.
