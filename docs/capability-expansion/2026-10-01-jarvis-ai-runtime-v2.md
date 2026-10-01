# JARVIS AI Runtime v2 — Capability Expansion

Date: 2026-10-01  
Status: review-ready, not production-deployed

## Objective

Extend the existing AL SIDR JARVIS control plane with a comprehensive, provider-agnostic AI runtime. This change does not create a second operating system, duplicate CRM, duplicate knowledge base, or parallel automation layer.

The runtime remains governed by the existing JARVIS principles:

1. verified system data overrides stale memory or assumptions;
2. external side effects use the existing risk/approval/verification gates;
3. model/provider availability never implies credentials or live access;
4. browser clients never receive secret provider keys;
5. long-term memory and high-risk tool execution are approval-gated;
6. all model/tool decisions remain traceable.

## Capability layers added

### Intelligence and model orchestration
- conversational generation;
- reasoning/plan generation without exposing private chain-of-thought;
- schema-validated structured outputs;
- hard-constraint model selection by required abilities, data class, quality and cost;
- preferred-provider ranking that cannot bypass hard constraints;
- retryable provider fallback;
- fail-closed behavior when no compatible/available model exists.

### Multimodal
- image understanding;
- image generation/editing;
- file understanding;
- audio input and transcription;
- audio/speech generation;
- realtime voice sessions;
- video understanding;
- video generation/animation.

### Knowledge and retrieval
- embeddings;
- reranking;
- governed RAG retrieval;
- public web research with citations/timestamps;
- scoped session memory;
- approval-gated long-term memory;
- source/freshness metadata;
- stale/conflicting knowledge checks.

### Agents and actions
- specialist-agent delegation with parent/child lineage;
- governed tool invocation;
- approval-gated computer use;
- bounded sandboxed code execution;
- existing workflow/webhook/idempotency/retry controls remain authoritative.

### Quality and safety
- AI output/model evaluation;
- regression checks;
- safety/privacy/policy inspection;
- evidence requirements per capability;
- data-classification constraints;
- audit and trace metadata.

## Runtime code

`packages/jarvis-core/src/ai-orchestrator.ts` is the provider-agnostic execution core.

It defines:
- `AIAbility`;
- `AIModelProfile`;
- `AIRequest`;
- `AIExecutionPlan`;
- model registry creation;
- compatibility filtering and ranking;
- canonical JARVIS specialist routing;
- provider adapter contract;
- retryable fallback execution.

Provider-specific SDK code must live behind `AIModelAdapter`. The core must never import provider SDKs directly.

## Registered runtime capabilities

The canonical capability registry now exposes:
- `ai.model.route`
- `ai.chat.generate`
- `ai.reason.plan`
- `ai.structured.generate`
- `ai.multimodal.understand`
- `ai.image.generate`
- `ai.audio.transcribe`
- `ai.audio.generate`
- `ai.voice.realtime`
- `ai.video.generate`
- `ai.embedding.create`
- `ai.rerank`
- `ai.web.research`
- `ai.code.execute`
- `ai.memory.read`
- `ai.memory.write`
- `ai.agent.delegate`
- `ai.tool.invoke`
- `ai.computer.use`
- `ai.evaluate`
- `ai.safety.inspect`

These are wired into JARVIS PRIME and existing specialist agents rather than introducing another agent hierarchy.

## Persistence migration

`supabase/migrations/20261001090000_add_os_ai_runtime.sql` extends the existing `public.os_*` control plane with:
- `os_ai_model_profiles`;
- `os_ai_sessions`;
- `os_ai_messages`;
- `os_ai_memory`;
- `os_ai_documents`;
- `os_ai_chunks`;
- `os_ai_tool_runs`;
- `os_ai_evaluations`.

The migration:
- enables pgvector;
- enables RLS on every added table;
- fails closed for `PUBLIC`, `anon` and `authenticated`;
- requires an approval reference for R2/R3 tool runs;
- requires an approval reference for long-term memory;
- supports versioned/superseded memories;
- stores evidence, citations, usage and trace metadata.

This migration is intentionally review-only until production approval, backup, security review and post-migration verification are completed.

## Provider activation contract

A provider/model is usable only when all of the following are true:
1. its model profile is enabled;
2. its required abilities match the request;
3. its data-classification allowance includes the request;
4. its quality tier meets the request floor;
5. its cost tier does not exceed the request ceiling;
6. a matching `AIModelAdapter` is registered;
7. required credentials exist in a deployment/provider secret store;
8. any side-effecting tool invoked by the model separately passes JARVIS policy.

Credentials are never committed to Git. The existing credential manifest remains the source for provider setup requirements.

## UI/API surface to expose

The existing JARVIS dashboard should expose these modules, backed by the canonical runtime:
- Ask JARVIS / command bar;
- model/provider health;
- active AI sessions;
- agent handoffs;
- knowledge/RAG search;
- memory controls;
- multimodal asset analysis/generation;
- voice session entry point;
- tool execution/approval queue;
- model usage and cost telemetry;
- evaluation/regression results;
- safety/privacy findings;
- full trace/audit view.

No UI should claim a model/provider is connected unless runtime verification succeeds.

## Verification

Behavioral tests cover:
- hard capability/data/quality/cost constraints;
- provider preference without constraint bypass;
- canonical specialist routing;
- retryable model fallback;
- fail-closed selection.

Repository CI additionally validates:
- TypeScript;
- unit tests;
- build;
- registry referential integrity;
- capability/agent risk ceilings;
- governance rules.

## Known activation blockers

- Lovable is not currently authorized to this chat session, so the Lovable UI cannot be synchronized directly from this execution.
- Provider-specific inference adapters and model profiles must be activated only after their credentials and supported features are verified.
- The Supabase AI persistence migration has not been applied to production in this change.
