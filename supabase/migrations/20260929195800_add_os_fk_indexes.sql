-- AL SIDR operating-layer foreign-key index hardening
-- Mirrors indexes verified in the live Supabase project on 2026-09-29.
-- This migration is a reconciliation step for environments that already have
-- the canonical OS baseline. Fresh databases must not fail when those tables
-- are not present yet.

do $$
begin
  if to_regclass('public.os_approvals') is not null then
    execute 'create index if not exists os_approvals_request_id_idx on public.os_approvals (request_id)';
  end if;

  if to_regclass('public.os_conflicts') is not null then
    execute 'create index if not exists os_conflicts_resolved_by_idx on public.os_conflicts (resolved_by)';
  end if;

  if to_regclass('public.os_facts') is not null then
    execute 'create index if not exists os_facts_owner_user_id_idx on public.os_facts (owner_user_id)';
    execute 'create index if not exists os_facts_source_id_idx on public.os_facts (source_id)';
    execute 'create index if not exists os_facts_supersedes_idx on public.os_facts (supersedes)';
  end if;
end
$$;
