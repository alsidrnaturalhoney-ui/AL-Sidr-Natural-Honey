-- AL SIDR operating-layer foreign-key index hardening
-- Mirrors indexes verified in the live Supabase project on 2026-09-29.
-- Safe to re-run because every index uses IF NOT EXISTS.

create index if not exists os_approvals_request_id_idx
  on public.os_approvals (request_id);

create index if not exists os_conflicts_resolved_by_idx
  on public.os_conflicts (resolved_by);

create index if not exists os_facts_owner_user_id_idx
  on public.os_facts (owner_user_id);

create index if not exists os_facts_source_id_idx
  on public.os_facts (source_id);

create index if not exists os_facts_supersedes_idx
  on public.os_facts (supersedes);
