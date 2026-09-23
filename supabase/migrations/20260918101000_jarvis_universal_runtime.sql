-- AL SIDR JARVIS universal runtime control plane
-- Prepared for review. Applying this migration is a production data/security change
-- and must pass the existing approval + security verification gate.

create table if not exists public.jarvis_agents (
  agent_id text primary key,
  version text not null,
  name text not null,
  purpose text not null,
  manifest jsonb not null,
  enabled boolean not null default true,
  source_commit text,
  synced_at timestamptz not null default now()
);

create table if not exists public.jarvis_skills (
  skill_id text primary key,
  version text not null,
  purpose text not null,
  owner_agent_id text not null,
  risk_class text not null check (risk_class in ('R0','R1','R2','R3')),
  manifest jsonb not null,
  enabled boolean not null default true,
  source_commit text,
  synced_at timestamptz not null default now()
);

create table if not exists public.jarvis_connectors (
  connector_id text primary key,
  platform text not null,
  authority_domain text not null,
  mode text not null check (mode in ('authority','adapter','orchestrator','observer')),
  connection_status text not null check (
    connection_status in (
      'verified-connected',
      'connected-limited',
      'registered-unverified',
      'blocked'
    )
  ),
  write_policy text not null check (
    write_policy in ('disabled','approval-required','allowed')
  ),
  max_risk text not null check (max_risk in ('R0','R1','R2','R3')),
  manifest jsonb not null,
  source_commit text,
  synced_at timestamptz not null default now()
);

create table if not exists public.jarvis_execution_requests (
  request_id text primary key,
  correlation_id text not null,
  actor_id text not null,
  source text not null,
  requested_outcome text not null,
  target text not null,
  capability text not null,
  operation text not null,
  arguments jsonb not null default '{}'::jsonb,
  confidence numeric(5,4) not null check (confidence >= 0 and confidence <= 1),
  status text not null default 'REQUESTED',
  requested_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists jarvis_execution_requests_correlation_idx
  on public.jarvis_execution_requests (correlation_id);
create index if not exists jarvis_execution_requests_status_idx
  on public.jarvis_execution_requests (status, created_at desc);

create table if not exists public.jarvis_plans (
  plan_id text primary key,
  request_id text not null references public.jarvis_execution_requests(request_id) on delete restrict,
  correlation_id text not null,
  plan_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.jarvis_plan_steps (
  plan_id text not null references public.jarvis_plans(plan_id) on delete cascade,
  step_id text not null,
  ordinal integer not null check (ordinal > 0),
  capability text not null,
  target text not null,
  operation text not null,
  arguments jsonb not null default '{}'::jsonb,
  expected_result jsonb not null default '{}'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  approval_reference text,
  rollback_reference text,
  dependencies jsonb not null default '[]'::jsonb,
  primary key (plan_id, step_id),
  unique (plan_id, ordinal)
);

create table if not exists public.jarvis_approvals (
  approval_id uuid primary key default gen_random_uuid(),
  request_id text not null references public.jarvis_execution_requests(request_id) on delete restrict,
  step_id text not null,
  approval_reference text not null unique,
  decision text not null check (decision in ('APPROVED','REJECTED','EXPIRED','REVOKED')),
  approver_id text not null,
  evidence jsonb not null default '{}'::jsonb,
  decided_at timestamptz not null default now()
);

create index if not exists jarvis_approvals_request_idx
  on public.jarvis_approvals (request_id, decided_at desc);

create table if not exists public.jarvis_action_results (
  result_id uuid primary key default gen_random_uuid(),
  request_id text not null references public.jarvis_execution_requests(request_id) on delete restrict,
  step_id text not null,
  status text not null check (status in ('EXECUTED','PARTIAL','FAILED','CANCELLED')),
  output jsonb not null default '{}'::jsonb,
  output_hash text not null,
  executed_at timestamptz not null default now()
);

create table if not exists public.jarvis_verifications (
  verification_id uuid primary key default gen_random_uuid(),
  request_id text not null references public.jarvis_execution_requests(request_id) on delete restrict,
  step_id text not null,
  matched boolean not null,
  evidence jsonb not null default '[]'::jsonb,
  observed jsonb not null default '{}'::jsonb,
  verifier_id text not null,
  verified_at timestamptz not null default now()
);

create table if not exists public.jarvis_audit_events (
  event_id uuid primary key default gen_random_uuid(),
  occurred_at timestamptz not null default now(),
  actor_id text not null,
  request_id text not null,
  correlation_id text not null,
  capability text not null,
  target text not null,
  risk_class text not null check (risk_class in ('R0','R1','R2','R3')),
  policy_decision text not null check (
    policy_decision in ('ALLOW','ALLOW_NOTIFY','REQUIRE_CONFIRMATION','DENY')
  ),
  execution_status text not null,
  input_hash text not null,
  output_hash text not null,
  approval_reference text,
  verification_evidence jsonb not null default '[]'::jsonb,
  event_payload jsonb not null default '{}'::jsonb
);

create index if not exists jarvis_audit_events_request_idx
  on public.jarvis_audit_events (request_id, occurred_at desc);
create index if not exists jarvis_audit_events_correlation_idx
  on public.jarvis_audit_events (correlation_id, occurred_at desc);

create table if not exists public.jarvis_truth_nodes (
  node_id text primary key,
  entity_type text not null,
  authority_domain text not null,
  authority_system text not null,
  canonical_key text not null,
  attributes jsonb not null default '{}'::jsonb,
  evidence jsonb not null default '[]'::jsonb,
  freshness_at timestamptz,
  source_version text,
  unique (authority_domain, canonical_key)
);

create table if not exists public.jarvis_truth_edges (
  edge_id uuid primary key default gen_random_uuid(),
  from_node_id text not null references public.jarvis_truth_nodes(node_id) on delete cascade,
  to_node_id text not null references public.jarvis_truth_nodes(node_id) on delete cascade,
  relation text not null,
  metadata jsonb not null default '{}'::jsonb,
  unique (from_node_id, to_node_id, relation)
);

create table if not exists public.jarvis_sync_state (
  sync_key text primary key,
  source_system text not null,
  target_system text not null,
  cursor_value text,
  last_success_at timestamptz,
  last_attempt_at timestamptz,
  last_error jsonb,
  state jsonb not null default '{}'::jsonb
);

create or replace function public.jarvis_block_audit_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'jarvis_audit_events is append-only';
end;
$$;

drop trigger if exists jarvis_audit_events_immutable on public.jarvis_audit_events;
create trigger jarvis_audit_events_immutable
before update or delete on public.jarvis_audit_events
for each row execute function public.jarvis_block_audit_mutation();

revoke execute on function public.jarvis_block_audit_mutation() from public;

alter table public.jarvis_agents enable row level security;
alter table public.jarvis_skills enable row level security;
alter table public.jarvis_connectors enable row level security;
alter table public.jarvis_execution_requests enable row level security;
alter table public.jarvis_plans enable row level security;
alter table public.jarvis_plan_steps enable row level security;
alter table public.jarvis_approvals enable row level security;
alter table public.jarvis_action_results enable row level security;
alter table public.jarvis_verifications enable row level security;
alter table public.jarvis_audit_events enable row level security;
alter table public.jarvis_truth_nodes enable row level security;
alter table public.jarvis_truth_edges enable row level security;
alter table public.jarvis_sync_state enable row level security;

-- Fail closed for browser/client roles. Server/service-role access is managed
-- outside these client roles and remains subject to the JARVIS capability gate.
revoke all on table public.jarvis_agents from anon, authenticated;
revoke all on table public.jarvis_skills from anon, authenticated;
revoke all on table public.jarvis_connectors from anon, authenticated;
revoke all on table public.jarvis_execution_requests from anon, authenticated;
revoke all on table public.jarvis_plans from anon, authenticated;
revoke all on table public.jarvis_plan_steps from anon, authenticated;
revoke all on table public.jarvis_approvals from anon, authenticated;
revoke all on table public.jarvis_action_results from anon, authenticated;
revoke all on table public.jarvis_verifications from anon, authenticated;
revoke all on table public.jarvis_audit_events from anon, authenticated;
revoke all on table public.jarvis_truth_nodes from anon, authenticated;
revoke all on table public.jarvis_truth_edges from anon, authenticated;
revoke all on table public.jarvis_sync_state from anon, authenticated;
