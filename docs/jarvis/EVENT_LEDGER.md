# JARVIS V6 — Event & Audit Ledger

Operational mutations and material decisions emit an immutable audit event.

## Required fields
- event_id
- timestamp
- actor
- capability
- action
- risk_class
- authority_domain
- source_system
- target_system
- input_hash
- output_hash
- permission_decision
- validation_result
- approval_reference
- idempotency_key
- execution_status
- verification_evidence
- rollback_reference
- correlation_id

## Lifecycle
`REQUESTED -> VALIDATED -> AUTHORIZED -> EXECUTED -> VERIFIED`

Failure states: `BLOCKED`, `REJECTED`, `FAILED`, `ROLLED_BACK`.

The ledger is append-only. Corrections are new events referencing the original event; historical events are not overwritten.
