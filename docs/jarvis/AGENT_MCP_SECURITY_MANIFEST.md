# JARVIS V6 — Agent/MCP Security Manifest

## Agent controls
Every agent receives an allowlist of skills and tools, a maximum risk class, authority domains, memory scope, and escalation target.

## MCP controls
Every MCP connector must declare authentication method, minimum scopes, authority domain, risk class, allowed operations, webhook verification, rate limits, timeout/retry policy, and audit events.

## Secret handling
- Credentials never enter source control.
- Credentials never enter prompts or documentation.
- Credentials never enter vector memory.
- Use least privilege.
- Rotate credentials according to provider policy.
- Record secret references, not secret values, in audit events.

## High-risk boundary
R4 and R5 operations require explicit approval and a verified execution target. The system must fail closed when a credential, permission, evidence requirement, or target cannot be verified.

## Connector lifecycle
`DISCOVERED -> REGISTERED -> AUTHENTICATED -> HEALTHY -> CONTRACT_TESTED -> ENABLED`

Failure or expiry moves a connector to `DEGRADED`, `DISABLED`, or `REVIEW`.
