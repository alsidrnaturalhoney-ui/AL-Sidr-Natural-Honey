-- AL SIDR AI Operating Layer runtime registries
-- Review before applying. This file does not deploy itself.

create extension if not exists pgcrypto;

create table if not exists public.agent_registry (
  id text primary key,
  name text not null,
  role text not null,
  core boolean not null default true,
  status text not null default 'READY',
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.skill_registry (
  id text primary key,
  owner_agent_id text references public.agent_registry(id) on update cascade,
  domain text not null,
  version text not null,
  status text not null default 'READY',
  source_path text not null,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.workflow_registry (
  id text primary key,
  owner_agent_id text references public.agent_registry(id) on update cascade,
  trigger_type text not null,
  source_system text,
  target_system text,
  risk_class text not null check (risk_class in ('R0','R1','R2','R3','R4','R5')),
  status text not null default 'DISCOVERED',
  definition_ref text not null,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.execution_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_id text references public.workflow_registry(id) on update cascade,
  agent_id text references public.agent_registry(id) on update cascade,
  correlation_id text not null,
  idempotency_key text not null,
  status text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  evidence jsonb not null default '[]'::jsonb,
  error_summary text,
  unique (workflow_id, idempotency_key)
);

create table if not exists public.approval_requests (
  id uuid primary key default gen_random_uuid(),
  execution_run_id uuid references public.execution_runs(id) on delete cascade,
  action_class text not null,
  requested_by text not null,
  status text not null default 'PENDING' check (status in ('PENDING','APPROVED','REJECTED','EXPIRED','CANCELLED')),
  reason text not null,
  evidence_refs jsonb not null default '[]'::jsonb,
  decided_by text,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_refs (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id text not null,
  topic text not null,
  source_class text not null,
  source_ref text not null,
  fact_status text not null,
  confidence numeric(4,3) check (confidence is null or (confidence >= 0 and confidence <= 1)),
  effective_at timestamptz,
  expires_at timestamptz,
  retrieved_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

alter table public.agent_registry enable row level security;
alter table public.skill_registry enable row level security;
alter table public.workflow_registry enable row level security;
alter table public.execution_runs enable row level security;
alter table public.approval_requests enable row level security;
alter table public.knowledge_refs enable row level security;

-- Registry knowledge is readable to authenticated AL SIDR users.
drop policy if exists "authenticated read agent registry" on public.agent_registry;
create policy "authenticated read agent registry" on public.agent_registry
  for select to authenticated using (true);

drop policy if exists "authenticated read skill registry" on public.skill_registry;
create policy "authenticated read skill registry" on public.skill_registry
  for select to authenticated using (true);

drop policy if exists "authenticated read workflow registry" on public.workflow_registry;
create policy "authenticated read workflow registry" on public.workflow_registry
  for select to authenticated using (true);

-- Runtime/audit tables are restricted to admin/operator identities encoded in
-- auth.users.raw_app_meta_data.role. Service-role automations remain server-side.
-- Adjust role names to the deployed identity model before migration approval.

drop policy if exists "operators manage agent registry" on public.agent_registry;
create policy "operators manage agent registry" on public.agent_registry
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','operator'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','operator'));

drop policy if exists "operators manage skill registry" on public.skill_registry;
create policy "operators manage skill registry" on public.skill_registry
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','operator'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','operator'));

drop policy if exists "operators manage workflow registry" on public.workflow_registry;
create policy "operators manage workflow registry" on public.workflow_registry
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','operator'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','operator'));

drop policy if exists "operators manage execution runs" on public.execution_runs;
create policy "operators manage execution runs" on public.execution_runs
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','operator'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','operator'));

drop policy if exists "operators manage approvals" on public.approval_requests;
create policy "operators manage approvals" on public.approval_requests
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','operator'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','operator'));

drop policy if exists "operators manage knowledge refs" on public.knowledge_refs;
create policy "operators manage knowledge refs" on public.knowledge_refs
  for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','operator'))
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') in ('admin','operator'));

create index if not exists execution_runs_correlation_idx on public.execution_runs(correlation_id);
create index if not exists approval_requests_status_idx on public.approval_requests(status, created_at desc);
create index if not exists knowledge_refs_entity_idx on public.knowledge_refs(entity_type, entity_id, topic);
create index if not exists knowledge_refs_expiry_idx on public.knowledge_refs(expires_at) where expires_at is not null;
