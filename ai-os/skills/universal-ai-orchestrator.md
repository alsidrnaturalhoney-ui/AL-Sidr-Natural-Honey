# Skill: Universal AI Orchestrator

## Purpose
Turn an AL SIDR business request into a verified execution plan across connected AI tools, MCP servers, SaaS connectors, code repositories, commerce systems, and knowledge stores.

## Inputs
Goal, constraints, desired outcome, risk level, available tools, current system state.

## Procedure
1. Retrieve relevant knowledge before acting.
2. Detect existing skills, agents, workflows, and assets; reuse instead of duplicating.
3. Classify the request: knowledge, content, commerce, engineering, analytics, design, identity, or operations.
4. Select the minimum capable toolchain.
5. Build an execution graph with dependencies and approval gates.
6. Execute reversible/read actions first.
7. Perform mutations only with the required permission.
8. Verify the post-state using an independent read-back.
9. Record outputs, decisions, failures, and follow-up work.
10. Escalate when permissions, credentials, or source truth are missing.

## Superpowers
- Cross-tool planning
- Duplicate detection
- Capability routing
- MCP/tool selection
- Verification-first execution
- Failure recovery
- Knowledge synthesis
- CEO-level prioritization

## Guardrails
Never invent credentials, URLs, API responses, analytics, inventory, or successful deployment states. Never expose secrets. Destructive operations require explicit authorization.
