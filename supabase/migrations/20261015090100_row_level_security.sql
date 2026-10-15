-- =============================================================================
-- Row Level Security
--
-- Rules enforced by Postgres itself (not by the UI):
--   * Anonymous visitors can read nothing.
--   * iSectAI platform admins (platform_admins) can read every business.
--   * Customer users (business_members) can only touch rows of their own business.
--   * A user who is in neither table sees nothing.
-- =============================================================================

-- Helper functions -------------------------------------------------------------
-- SECURITY DEFINER lets the policies look up the membership tables without
-- recursing into those tables' own policies. search_path is pinned for safety.
create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from core.platform_admins pa where pa.user_id = (select auth.uid())
  );
$$;

create or replace function public.current_user_business_ids()
returns setof uuid
language sql
stable
security definer
set search_path = ''
as $$
  select bm.business_id from core.business_members bm where bm.user_id = (select auth.uid());
$$;

revoke all on function public.is_platform_admin() from public, anon;
revoke all on function public.current_user_business_ids() from public, anon;
grant execute on function public.is_platform_admin() to authenticated;
grant execute on function public.current_user_business_ids() to authenticated;

-- Anonymous role gets no table access at all -----------------------------------
revoke all on all tables in schema core, medical, field_service from anon;
alter default privileges in schema core revoke all on tables from anon;
alter default privileges in schema medical revoke all on tables from anon;
alter default privileges in schema field_service revoke all on tables from anon;

-- Custom schemas need explicit permissions for the API roles. RLS below still
-- decides which ROWS a signed-in user can see.
grant usage on schema core, medical, field_service to authenticated;
grant select, insert, update, delete on all tables in schema core, medical, field_service to authenticated;
alter default privileges in schema core grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema medical grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema field_service grant select, insert, update, delete on tables to authenticated;

-- Turn RLS on everywhere (with no policy, access is denied by default) ---------
alter table core.industries        enable row level security;
alter table core.businesses        enable row level security;
alter table core.locations         enable row level security;
alter table core.staff             enable row level security;
alter table core.customers         enable row level security;
alter table medical.appointments      enable row level security;
alter table field_service.jobs              enable row level security;
alter table core.activity_events   enable row level security;
alter table core.platform_admins   enable row level security;
alter table core.business_members  enable row level security;

-- Access tables: users can read their own membership row -----------------------
create policy "users read their own admin row"
  on core.platform_admins for select to authenticated
  using (user_id = (select auth.uid()));

create policy "users read their own memberships"
  on core.business_members for select to authenticated
  using (user_id = (select auth.uid()));

create policy "platform admins read all memberships"
  on core.business_members for select to authenticated
  using (public.is_platform_admin());

-- Reference data ---------------------------------------------------------------
create policy "signed-in users read industries"
  on core.industries for select to authenticated
  using (true);

create policy "platform admins manage industries"
  on core.industries for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

-- Businesses -------------------------------------------------------------------
create policy "platform admins manage businesses"
  on core.businesses for all to authenticated
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

create policy "members read their own business"
  on core.businesses for select to authenticated
  using (id in (select public.current_user_business_ids()));

-- Tenant-owned tables: same two rules for each ---------------------------------
--   admins  -> read everything (the dashboard is for monitoring)
--   members -> full access, but only inside their own business
do $$
declare
  tenant_table text;
begin
  foreach tenant_table in array array[
    'core.locations', 'core.staff', 'core.customers',
    'medical.appointments', 'field_service.jobs'
  ]
  loop
    execute format(
      'create policy "platform admins read all" on %s for select to authenticated using (public.is_platform_admin())',
      tenant_table
    );
    execute format(
      'create policy "members manage own" on %s for all to authenticated '
      'using (business_id in (select public.current_user_business_ids())) '
      'with check (business_id in (select public.current_user_business_ids()))',
      tenant_table
    );
  end loop;
end
$$;

create policy "platform admins read all activity"
  on core.activity_events for select to authenticated
  using (public.is_platform_admin());

create policy "members read own activity"
  on core.activity_events for select to authenticated
  using (business_id in (select public.current_user_business_ids()));