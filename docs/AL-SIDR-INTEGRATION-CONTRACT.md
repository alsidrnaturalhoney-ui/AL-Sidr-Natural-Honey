# AL SIDR Integration Contract

## Data flow

- Shopify -> operational analytics/validation systems: commerce events and catalog metadata only as required.
- GitHub -> security/release systems: commits, pull requests, release evidence.
- Asana <-> Airtable: execution references and operational registry; neither replaces the other's role.
- Linear -> engineering planning; GitHub remains implementation/source control.
- Figma -> approved design artifacts; Color Designer is the palette exploration layer.
- Notion -> governance and knowledge; links to canonical artifacts rather than duplicating them.
- Manus -> executes governed tasks and reports outcomes back to the appropriate system.
- Chronos -> schedules governed Codex jobs when connected.

## Validation ledger

Every meaningful automated change should have:

- system
- action
- source
- target
- timestamp
- actor/automation
- validation result
- evidence link
- rollback path where applicable

## Approval gates

Production-impacting changes require the appropriate owner review. Security-sensitive, destructive, customer-data, payment, shipping and legal/compliance changes require explicit validation before release.
