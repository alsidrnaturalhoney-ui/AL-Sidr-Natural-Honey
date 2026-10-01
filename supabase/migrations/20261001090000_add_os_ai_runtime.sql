-- AL SIDR OS / JARVIS AI runtime persistence layer
-- Review-only migration: do not apply to production without the existing
-- approval, security, backup, and verification gates.
--
-- Extends the canonical public.os_* control plane. It does not create a
-- parallel JARVIS database namespace.

create extension if not exists vector with schema extensions;

create table if not exists public.os_ai_model_profiles (
  model_profile_id text primary key,
  provider text not null,
  model_name text not null,
  abilities text[] not null default '{}',
  quality_tier integer not null check (quality_tier between 1 and 5),
  speed_tier integer not null check (speed_tier between 1 and 5),
  cost_tier integer not null check (cost_tier between 1 and 5),
  data_classes text[] not null default '{}',
  status text not null default 'DISABLED'
    check (status in ('ACTIVE','DISABLED','DEGRADED','UNVERIFIED')),
  definition jsonb not null default '{}'::jsonb,
  last_verified_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.os_ai_sessions (
  id uuid primary key default gen_random_uuid(),
  correlation_id uuid,
  actor_id text,
  business_intent text,
  data_classification text not null
    check (data_classification in ('public','internal','confidential','restricted')),
  grounding_mode text not null default 'required'
    check (grounding_mode in ('optional','required')),
  memory_mode text not null default 'session'
    check (memory_mode in ('none','session','long-term')),
  tool_access text not null default 'read-only'
    check (tool_access in ('disabled','read-only','approval-gated')),
  selected_model_profile_id text
    references public.os_ai_model_profiles(model_profile_id) on delete set null,
  status text not null default 'ACTIVE'
    check (status in ('ACTIVE','COMPLETED','FAILED','CANCELLED')),
  created_at timestamptz not null default now(),
  ended_at timestamptz
);

create index if not exists os_ai_sessions_correlation_idx
  on public.os_ai_sessions (correlation_id, created_at desc);
create index if not exists os_ai_sessions_status_idx
  on public.os_ai_sessions (status, created_at desc);

create table if not exists public.os_ai_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null
    references public.os_ai_sessions(id) on delete cascade,
  role text not null
    check (role in ('system','user','assistant','tool')),
  content jsonb not null default '{}'::jsonb,
  input_modalities text[] not null default '{}',
  output_modalities text[] not null default '{}',
  model_profile_id text
    references public.os_ai_model_profiles(model_profile_id) on delete set null,
  citations jsonb not null default '[]'::jsonb,
  usage jsonb not null default '{}'::jsonb,
  trace jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists os_ai_messages_session_idx
  on public.os_ai_messages (session_id, created_at);

create table if not exists public.os_ai_memory (
  id uuid primary key default gen_random_uuid(),
  scope text not null check (scope in ('session','long-term')),
  session_id uuid
    references public.os_ai_sessions(id) on delete cascade,
  subject_type text not null,
  subject_id text not null,
  content jsonb not null,
  data_classification text not null
    check (data_classification in ('public','internal','confidential','restricted')),
  source_refs jsonb not null default '[]'::jsonb,
  approval_request_id uuid
    references public.os_approval_requests(id) on delete restrict,
  status text not null default 'ACTIVE'
    check (status in ('ACTIVE','SUPERSEDED','REVOKED')),
  supersedes uuid
    references public.os_ai_memory(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (scope = 'session' and session_id is not null)
    or
    (scope = 'long-term' and approval_request_id is not null)
  )
);

create index if not exists os_ai_memory_subject_idx
  on public.os_ai_memory (subject_type, subject_id, status);
create index if not exists os_ai_memory_session_idx
  on public.os_ai_memory (session_id, created_at desc);

create table if not exists public.os_ai_documents (
  id uuid primary key default gen_random_uuid(),
  source_system text not null,
  source_ref text not null,
  title text,
  content_hash text not null,
  data_classification text not null
    check (data_classification in ('public','internal','confidential','restricted')),
  freshness_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (source_system, source_ref, content_hash)
);

create table if not exists public.os_ai_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null
    references public.os_ai_documents(id) on delete cascade,
  chunk_index integer not null check (chunk_index >= 0),
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  embedding_model text,
  embedding_dimensions integer check (embedding_dimensions is null or embedding_dimensions > 0),
  embedding extensions.vector,
  created_at timestamptz not null default now(),
  unique (document_id, chunk_index),
  check (
    (embedding is null and embedding_model is null and embedding_dimensions is null)
    or
    (
      embedding is not null
      and embedding_model is not null
      and embedding_dimensions is not null
      and extensions.vector_dims(embedding) = embedding_dimensions
    )
  )
);

create index if not exists os_ai_chunks_document_idx
  on public.os_ai_chunks (document_id, chunk_index);
create index if not exists os_ai_chunks_embedding_model_idx
  on public.os_ai_chunks (embedding_model, embedding_dimensions)
  where embedding is not null;

create table if not exists public.os_ai_tool_runs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid
    references public.os_ai_sessions(id) on delete set null,
  execution_run_id uuid
    references public.os_execution_runs(id) on delete set null,
  tool_id text
    references public.os_ai_tools(tool_id) on delete restrict,
  capability text not null,
  operation text not null,
  risk_level text not null
    check (risk_level in ('R0','R1','R2','R3')),
  approval_request_id uuid
    references public.os_approval_requests(id) on delete restrict,
  input_hash text not null,
  output_hash text,
  status text not null
    check (status in ('PLANNED','BLOCKED','RUNNING','SUCCEEDED','FAILED','CANCELLED')),
  evidence jsonb not null default '[]'::jsonb,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  check (
    risk_level not in ('R2','R3')
    or approval_request_id is not null
  )
);

create index if not exists os_ai_tool_runs_session_idx
  on public.os_ai_tool_runs (session_id, created_at desc);
create index if not exists os_ai_tool_runs_execution_idx
  on public.os_ai_tool_runs (execution_run_id, created_at desc);

create table if not exists public.os_ai_evaluations (
  id uuid primary key default gen_random_uuid(),
  session_id uuid
    references public.os_ai_sessions(id) on delete set null,
  model_profile_id text
    references public.os_ai_model_profiles(model_profile_id) on delete set null,
  eval_type text not null,
  rubric jsonb not null default '{}'::jsonb,
  score numeric,
  status text not null
    check (status in ('PASS','FAIL','PARTIAL','ERROR')),
  evidence jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists os_ai_evaluations_model_idx
  on public.os_ai_evaluations (model_profile_id, created_at desc);
create index if not exists os_ai_evaluations_session_idx
  on public.os_ai_evaluations (session_id, created_at desc);

alter table public.os_ai_model_profiles enable row level security;
alter table public.os_ai_sessions enable row level security;
alter table public.os_ai_messages enable row level security;
alter table public.os_ai_memory enable row level security;
alter table public.os_ai_documents enable row level security;
alter table public.os_ai_chunks enable row level security;
alter table public.os_ai_tool_runs enable row level security;
alter table public.os_ai_evaluations enable row level security;

-- Fail closed for browser/client roles. Server-side access remains subject to
-- JARVIS capability, approval, and audit gates.
revoke all on table public.os_ai_model_profiles from PUBLIC, anon, authenticated;
revoke all on table public.os_ai_sessions from PUBLIC, anon, authenticated;
revoke all on table public.os_ai_messages from PUBLIC, anon, authenticated;
revoke all on table public.os_ai_memory from PUBLIC, anon, authenticated;
revoke all on table public.os_ai_documents from PUBLIC, anon, authenticated;
revoke all on table public.os_ai_chunks from PUBLIC, anon, authenticated;
revoke all on table public.os_ai_tool_runs from PUBLIC, anon, authenticated;
revoke all on table public.os_ai_evaluations from PUBLIC, anon, authenticated;
