# JARVIS V6 — Execution Gates

## Universal mutation pipeline

`GENERATE -> VALIDATE -> DIFF -> AUTHORIZE -> EXECUTE -> VERIFY -> AUDIT`

## Required checks

1. Schema/type validation
2. Authority resolution
3. Permission/risk evaluation
4. Claim/compliance validation when applicable
5. Dependency resolution
6. Security checks
7. Test execution
8. Change diff review
9. Rollback readiness
10. Post-execution verification

## Completion rule

No component may report success, synchronization, deployment, publication, or completion without fresh verification evidence from the relevant system.

## Production policy

Production changes are never inferred from a draft. Staging validation is required where the change class supports it. R4/R5 operations require explicit human authorization.
