# AL SIDR JARVIS Core v1 — Architecture Design

**Date:** 2026-09-13  
**Status:** Design approved in conversation; implementation pending written-spec review  
**Canonical repository:** `alsidrnaturalhoney-ui/AL-Sidr-Natural-Honey`  
**Canonical location:** Existing `JARVIS-OS` / `ai-os` ecosystem; this document does not create a parallel operating system.

## 1. Purpose

JARVIS Core v1 is the governed AI execution layer for AL SIDR Natural Honey. It converts the existing AL SIDR AI/JARVIS knowledge, agents, skills, integrations, security rules, and executive workflows into one practical runtime capable of:

- receiving user or event-driven requests;
- loading trusted business context;
- selecting deterministic or agentic reasoning paths;
- proposing and executing tool actions through governed capabilities;
- requiring human approval for higher-risk actions;
- verifying real-world outcomes before reporting success;
- recording auditable execution history;
- presenting a premium visual command-center experience.

The design extends the repository's existing `JARVIS-OS` and `ai-os` assets. It must reuse canonical AL SIDR systems rather than introduce competing dashboards, databases, task managers, memories, or policy stores.

## 2. Product principles

1. **Truth before autonomy.** Live verified system data overrides stale documentation, assumptions, or model memory.
2. **Read before write.** JARVIS should inspect state and dependencies before mutation.
3. **Smallest sufficient action.** Prefer the least-privileged, least-destructive capability that achieves the goal.
4. **No silent high-risk action.** Destructive, financial, customer-impacting, credential, deployment, public-publishing, or physical-security actions require explicit policy treatment and, where configured, human approval.
5. **Verification is mandatory.** A tool returning success is not enough; JARVIS compares intended versus observed state.
6. **One source of truth per domain.** Existing canonical AL SIDR ownership remains authoritative.
7. **Bilingual-ready.** English and Arabic/RTL presentation must be supported where the user-facing experience requires it.
8. **Premium but operational.** The UI is visual-first and high-end, but status, risk, provenance, and action history remain readable and auditable.

## 3. Canonical ownership

| Domain | Canonical owner |
| --- | --- |
| Live commerce/catalog/orders | Shopify |
| Executive knowledge, SOPs, governance | Notion |
| Engineering source/configuration | GitHub |
| Application state, auth, runtime data, audit ledger | Supabase |
| Business execution/tasks | Existing execution system(s), not duplicated inside JARVIS |
| Developer/system documentation | GitBook + repository docs |
| Cross-channel analytics | Connected analytics sources / Supermetrics once authenticated |
| Customer calling/messaging intelligence | Quo when inboxes are connected |
| Deploy/runtime surface | Vercel when provisioned |

JARVIS stores references, normalized state, workflow state, approvals, and execution evidence. It does not copy complete authoritative datasets unless needed for caching, retrieval, or historical audit with a defined retention policy.

## 4. System architecture

```text
Human / Schedule / Webhook / Sensor
                |
                v
      Interface & Event Gateway
                |
                v
         Intent/Event Router
          /             \
         v               v
 System 1 Reflex     System 2 Agent
 deterministic       deep reasoning
          \             /
           v           v
           Context Hydrator
      Notion + Supabase + RAG
                |
                v
           JARVIS Planner
                |
                v
       Security Policy Gateway
     auth + capability + risk +
      scope + approval + audit
          /      |       \
         v       v        v
      ALLOW   APPROVAL    DENY
         \       |       /
          v      v      v
          Capability / MCP Bus
                |
       External Tools & Systems
                |
                v
         Result Verification
          /              \
      success           mismatch
         |                 |
         v                 v
      Record          Diagnose/repair
          \              /
           v            v
          Memory + Audit Ledger
                |
                v
        Response / HUD / Voice
```

Security is not merely a sequential layer. Authorization, privacy, data-minimization, audit, and output controls wrap perception, retrieval, planning, execution, storage, and response.

## 5. Runtime components

### 5.1 Interface & Event Gateway

Initial surfaces:

- premium web command center;
- text/chat interaction;
- structured action cards and approval prompts;
- schedules/webhooks/events.

Later surfaces may include React Native mobile and low-latency voice. Voice is not required for Core v1 correctness.

### 5.2 Intent/Event Router

Every input becomes a normalized `ExecutionRequest` with:

- actor/session identity;
- source channel;
- requested outcome;
- target resource(s);
- inferred capability;
- confidence;
- event timestamp and correlation ID.

The router chooses:

- **System 1:** deterministic, pre-approved, low-complexity workflows;
- **System 2:** multi-step reasoning/planning when ambiguity, dependencies, or broader context are required.

The router must not directly execute external writes.

### 5.3 Context Hydrator

Loads only the minimum context needed for the request:

- current session and workflow state from Supabase;
- approved business policy and SOP references from Notion/repository knowledge;
- relevant retrieved documents;
- current tool/resource state where freshness matters.

Hydrated context records provenance and freshness metadata. Stale or conflicting context is surfaced to the planner rather than silently merged.

### 5.4 Planner

The planner produces a structured `ActionPlan` rather than free-form tool instructions. Each step includes:

- capability name;
- target;
- operation;
- arguments;
- expected result;
- reversibility;
- side-effect class;
- prerequisite evidence;
- verification query/check;
- fallback/rollback where applicable.

### 5.5 Security Policy Gateway

All tool calls pass through one non-bypassable gateway outside the model's discretionary reasoning.

Risk classes:

| Class | Typical actions | Default |
| --- | --- | --- |
| R0 — Read/Local | read data, inspect status, search docs, run local analysis | allow + audit |
| R1 — Reversible Routine Write | draft, create internal task, update safe noncritical metadata | allow/notify according to capability policy |
| R2 — Sensitive External Write | send customer/business communication, publish content, deploy code, production data update | explicit capability policy; often approval |
| R3 — Critical | financial transfer, destructive deletion, credential/security change, production schema destruction, physical access/security controls | explicit confirmation + strong authentication; otherwise deny |

Possible decisions:

- `ALLOW`
- `ALLOW_NOTIFY`
- `REQUIRE_CONFIRMATION`
- `DENY`

The model cannot downgrade or override the policy result.

### 5.6 Capability Registry / MCP Bus

Each capability is registered with machine-readable metadata:

- canonical name and version;
- provider/system;
- read/write classification;
- risk class;
- input/output schema;
- required scopes;
- data-sensitivity classification;
- reversibility;
- confirmation rule;
- timeout/retry policy;
- verification strategy;
- enabled environments;
- owner and documentation reference.

MCP, direct API connectors, WebMCP, internal functions, and approved automation endpoints are normalized behind this registry.

### 5.7 Execution Engine

Executes only policy-approved plan steps. Requirements:

- idempotency keys for repeatable writes where supported;
- correlation IDs across requests, tool calls, retries, and verification;
- bounded retries for transient failures;
- cancellation support;
- timeout handling;
- partial-failure semantics;
- no hidden fallback to broader permissions.

### 5.8 Verification Engine

For every material mutation:

```text
Expected state -> execute -> observe actual state -> compare
                                    |
                       match ---------------- mismatch
                         |                |
                       record      diagnose/repair/escalate
```

Verification should use an independent read where practical rather than trusting only the mutation response.

### 5.9 Memory & Audit

Core v1 memory categories:

- **session state** — current conversation/workflow;
- **execution history** — plans, actions, results, verification;
- **approval history** — who approved what and when;
- **operational memory** — reusable preferences/decisions with provenance;
- **retrieval indexes** — references to trusted knowledge, not uncontrolled duplication.

Every external mutation receives an immutable logical audit event even if downstream systems also maintain their own logs.

### 5.10 Response & Experience

The premium command center should surface:

- system health;
- active workflows;
- action queue;
- approval queue;
- risks/anomalies;
- business opportunities;
- recent verified actions;
- evidence/provenance drawer;
- conversational command input;
- bilingual-ready presentation.

Brand direction: charcoal/deep black, AL SIDR gold, natural cream, restrained glass/holographic depth, high contrast, visual status nodes, minimal decorative noise.

## 6. Supabase runtime model

Existing tables `dsp_runs`, `audit_logs`, and `experiments` are useful foundations but are not sufficient by themselves for Core v1.

Proposed runtime entities (final names may be adjusted to existing schema conventions during implementation):

- `jarvis_sessions`
- `jarvis_execution_requests`
- `jarvis_plans`
- `jarvis_plan_steps`
- `jarvis_capabilities`
- `jarvis_approvals`
- `jarvis_action_results`
- `jarvis_verifications`
- `jarvis_events`
- `jarvis_memory_records`

Existing `audit_logs` should remain the high-level mutation/audit sink unless schema review shows a reason to evolve it rather than duplicate it.

### Current security blocker

As of the live inspection on 2026-09-13, Supabase Security Advisor reports that `public.audit_logs`, `public.dsp_runs`, and `public.experiments` have RLS enabled but no policies. Core v1 must not enable autonomous client-side access until the intended service/server access model is explicitly designed, policies/grants are implemented, and the advisor is re-run.

The design must follow least privilege:

- no `service_role`/secret keys in public clients;
- RLS on exposed user-facing tables;
- authorization based on trusted app metadata/ownership, never user-editable metadata;
- privileged functions isolated from exposed schemas and tightly scoped;
- secrets held only in approved secret/environment stores.

## 7. Agent model

Core v1 uses one orchestrator with specialist capabilities rather than a swarm of independent autonomous systems.

Logical specialist roles can include commerce, SEO/content, analytics, engineering, security, research, and executive intelligence, but they share:

- one policy gateway;
- one capability registry;
- one audit model;
- one source-of-truth map;
- one verification contract.

Specialists may propose actions; only the execution engine can perform approved external actions.

## 8. Durable workflows and proactive operation

Long-running jobs must support pause/resume, retries, human approval waits, and recovery after process restarts. Typical proactive sources:

- scheduled checks;
- inbound webhooks;
- analytics anomalies;
- inventory thresholds;
- task/deadline events;
- security/system-health events.

Proactive runs should default to silent handling of normal states and surface only:

- approval-required decisions;
- unresolved failures;
- high-impact risks;
- material opportunities;
- concise verified summaries.

## 9. Integration boundaries

### Core integrations

- GitHub — source control, reviewable engineering changes;
- Supabase — runtime state, audit, auth/backend;
- Notion — canonical business knowledge/governance retrieval;
- GitBook — system/developer documentation;
- Vercel — target web/runtime/deployment surface after project provisioning;
- MCP/connectors — governed external capability interface.

### Conditional integrations

- Supermetrics — enabled when specific analytics sources are authenticated;
- Quo — enabled when inboxes/data become available;
- React Native — mobile client phase;
- WebMCP — expose carefully chosen browser-native agent actions;
- Manus — delegated bounded tasks under the same governance contract;
- VIXNODE — optional specialist web-production surface only, not a source of truth;
- QuickNode — optional future infrastructure only when a real blockchain/Web3 use case exists;
- VillageSQL — specialist database extension capability, not a Core v1 dependency.

## 10. WebMCP and MCP design

Browser tools and remote MCP tools must be explicitly separated:

- **Remote MCP/App tools:** server-side governed capabilities reusable by assistants and agents.
- **WebMCP tools:** browser-page actions exposed to in-browser agents where the user interface itself is the resource.

No browser tool should expose a broader privilege than the human user currently possesses in the page/session. Write-capable browser paths must declare accurate side effects and must not bypass Layer 9 approval policy.

## 11. Error handling

Every step ends in one of:

- `SUCCESS`
- `PARTIAL`
- `FAILED`
- `CANCELLED`
- `WAITING_APPROVAL`
- `DENIED`

Failure handling order:

1. classify transient vs deterministic failure;
2. retry only when safe and bounded;
3. verify whether partial side effects occurred;
4. rollback when supported and policy-approved;
5. otherwise preserve evidence and escalate with a concise recommended next action.

Never report a repaired/finished state without re-verification.

## 12. Observability

Minimum telemetry:

- request ID and correlation ID;
- latency by stage;
- model/provider used;
- tool/capability called;
- policy decision;
- approval latency;
- tool success/failure;
- verification result;
- retries/cancellations;
- token/cost metrics where available;
- user-visible outcome.

Sensitive arguments and PII must be redacted from general telemetry while remaining recoverable only through appropriately protected audit storage when legally and operationally justified.

## 13. Deployment model

Target architecture:

```text
Vercel Web App / API
        |
        +-- JARVIS Router / Planner / Response
        +-- Durable workflow layer
        +-- MCP/connectors
        |
     Supabase
        +-- Auth
        +-- Postgres
        +-- Realtime (where needed)
        +-- Storage (only where justified)
        +-- scheduled/server functions when selected
```

GitHub remains the release source. Production deployment follows branch/PR review, automated checks, security review, deploy, and post-deploy verification.

## 14. Implementation boundaries for v1

**In scope:**

- web command-center shell;
- authenticated session model;
- System 1/System 2 routing contract;
- structured planner contract;
- Layer 9 security/policy engine;
- capability registry;
- approval queue;
- execution + independent verification loop;
- audit/event storage;
- initial read-only connectors plus one or more low-risk test write capabilities;
- observability;
- premium AL SIDR UI foundation;
- developer documentation.

**Out of scope for Core v1:**

- always-on microphone/camera hardware;
- biometric identity;
- smart-lock/physical-security control;
- robotics/drones;
- autonomous financial transactions;
- unrestricted production writes;
- uncontrolled self-modifying agents;
- full mobile/AR/VR clients;
- Web3 infrastructure without a validated business requirement.

## 15. Acceptance criteria

Core v1 is complete only when all of the following are demonstrated:

1. A user can authenticate and open the JARVIS command center.
2. A request is converted into a typed execution request and routed through System 1 or System 2.
3. Context provenance/freshness is visible to the planner.
4. Every tool action goes through the policy gateway.
5. At least one R0 action executes end-to-end and records audit evidence.
6. At least one approval-required action pauses, obtains approval, resumes, executes, and records the approver.
7. A denied action cannot be executed through an alternate application path.
8. Material writes include an independent verification step.
9. Failure/partial-success handling preserves evidence and does not falsely report completion.
10. Supabase security policies/grants pass the relevant security advisor checks for the implemented schema.
11. No secrets are exposed to the browser, repository, prompts, logs, or documentation.
12. CI runs type checks, tests, and build checks for the implemented JARVIS code.
13. The final PR receives diff review before merge.
14. Production deployment, if performed, is verified after release.

## 16. Testing strategy

- unit tests for risk classification, policy decisions, capability schemas, routing, and planner validation;
- integration tests for Supabase persistence and representative tool adapters;
- contract tests for MCP/tool input-output schemas;
- adversarial tests proving R2/R3 operations cannot bypass approval;
- retry/idempotency tests;
- verification-mismatch tests;
- end-to-end browser tests for chat/request -> approval -> execution -> verified result;
- accessibility and RTL smoke tests for user-facing UI;
- security checks for RLS, public-key exposure, unsafe server functions, and secret leakage.

## 17. Implementation sequence

The detailed task plan is intentionally deferred until this written architecture is reviewed. The expected high-level order is:

**foundation/security -> data model -> policy/capability registry -> execution/verification -> AI router/planner -> UI -> connectors -> observability -> hardening -> deployment**.

No production write capability should be enabled ahead of the policy, audit, and verification foundations it depends on.

## 18. Design decision summary

JARVIS Core v1 is a governed control plane, not a free-running chatbot and not a collection of disconnected agents. The model reasons and proposes; the policy gateway authorizes; the execution engine acts; the verification engine proves; the audit layer records; the command center explains what matters.
