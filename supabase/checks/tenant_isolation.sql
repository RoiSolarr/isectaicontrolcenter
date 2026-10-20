-- =============================================================================
-- Tenant isolation tests - SUPABASE SQL EDITOR VERSION (single statement)
--
-- 31 checks that prove, with the real seed data and real RLS policies, that:
--   * anonymous visitors can read nothing
--   * a customer user (Lakefront) only sees and touches Lakefront rows
--   * a signed-in user in no business sees nothing
--   * a platform admin reads every business but cannot write tenant records
--   * composite foreign keys block cross-business references
--
-- HOW TO USE
--   1. Supabase dashboard -> SQL Editor -> New query.
--   2. Paste this whole file, click Run.
--   3. The result is a red "error" starting with  PASSED n of 31 checks  followed
--      by one line per check. That is expected: raising an error is how this
--      script prints its report AND guarantees every change is rolled back.
--
-- Needs the demo seed data (supabase/seed.sql) loaded in the project.
-- Runs as ONE statement, so it does not depend on the editor keeping state
-- between statements.
-- =============================================================================
do $outer$
declare
  tests    jsonb := $j$[
 [
  "owner",
  "eq",
  "Row Level Security is enabled on all 10 tables",
  "select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace where c.relrowsecurity and (n.nspname, c.relname) in (('core','industries'),('core','businesses'),('core','locations'),('core','staff'),('core','customers'),('core','activity_events'),('core','platform_admins'),('core','business_members'),('medical','appointments'),('field_service','jobs'))",
  "10"
 ],
 [
  "owner",
  "eq",
  "business_stats view runs with the caller's permissions (security_invoker)",
  "select coalesce((select 'security_invoker=true' = any (reloptions) from pg_class where oid = 'core.business_stats'::regclass), false)",
  "true"
 ],
 [
  "anon",
  "error",
  "anonymous visitor cannot read businesses",
  "select count(*) from core.businesses",
  "42501"
 ],
 [
  "anon",
  "error",
  "anonymous visitor cannot read appointments",
  "select count(*) from medical.appointments",
  "42501"
 ],
 [
  "anon",
  "error",
  "anonymous visitor cannot read jobs",
  "select count(*) from field_service.jobs",
  "42501"
 ],
 [
  "customer",
  "eq",
  "customer sees exactly one business",
  "select count(*) from core.businesses",
  "1"
 ],
 [
  "customer",
  "eq",
  "and that business is Lakefront",
  "select id::text from core.businesses",
  "{LF}"
 ],
 [
  "customer",
  "eq",
  "customer can see their own appointments (so the checks below are not passing on an empty table)",
  "select count(*) > 0 from medical.appointments",
  "true"
 ],
 [
  "customer",
  "eq",
  "customer sees no appointments from other businesses",
  "select count(*) from medical.appointments where business_id <> '{LF}'",
  "0"
 ],
 [
  "customer",
  "eq",
  "customer sees no jobs (those belong to Northstar)",
  "select count(*) from field_service.jobs",
  "0"
 ],
 [
  "customer",
  "eq",
  "customer sees no customers of other businesses",
  "select count(*) from core.customers where business_id <> '{LF}'",
  "0"
 ],
 [
  "customer",
  "eq",
  "customer sees no staff of other businesses",
  "select count(*) from core.staff where business_id <> '{LF}'",
  "0"
 ],
 [
  "customer",
  "eq",
  "customer sees no locations of other businesses",
  "select count(*) from core.locations where business_id <> '{LF}'",
  "0"
 ],
 [
  "customer",
  "eq",
  "customer sees no activity of other businesses",
  "select count(*) from core.activity_events where business_id <> '{LF}'",
  "0"
 ],
 [
  "customer",
  "eq",
  "customer cannot see platform administrator accounts",
  "select count(*) from core.platform_admins",
  "0"
 ],
 [
  "customer",
  "eq",
  "customer sees only their own membership row",
  "select count(*) from core.business_members",
  "1"
 ],
 [
  "customer",
  "eq",
  "dashboard stats view shows only the customer's own business",
  "select count(*) from core.business_stats",
  "1"
 ],
 [
  "customer",
  "error",
  "customer cannot create an appointment inside another business",
  "insert into medical.appointments (business_id, location_id, customer_id, visit_type, starts_at) values ('{CLV}', '{CLV_LOC}', '{CLV_CUST}', 'cross-tenant insert test', now())",
  "42501"
 ],
 [
  "customer",
  "runs",
  "customer delete aimed at another business runs but matches no rows",
  "delete from medical.appointments where business_id = '{CLV}'",
  ""
 ],
 [
  "customer",
  "runs",
  "customer update aimed at another business runs but matches no rows",
  "update core.customers set display_name = 'HACKED' where business_id = '{CLV}'",
  ""
 ],
 [
  "owner",
  "eq",
  "all Clearview appointments are still there",
  "select count(*) from medical.appointments where business_id = '{CLV}'",
  "{CLV_APPTS}"
 ],
 [
  "owner",
  "eq",
  "no Clearview customer was renamed",
  "select count(*) from core.customers where display_name = 'HACKED'",
  "0"
 ],
 [
  "owner",
  "error",
  "an appointment cannot point at a customer of a different business",
  "insert into medical.appointments (business_id, location_id, customer_id, visit_type, starts_at) values ('{LF}', '{LF_LOC}', '{CLV_CUST}', 'cross-tenant reference test', now())",
  "23503"
 ],
 [
  "nobody",
  "eq",
  "a user in no business sees no businesses",
  "select count(*) from core.businesses",
  "0"
 ],
 [
  "nobody",
  "eq",
  "a user in no business sees no appointments",
  "select count(*) from medical.appointments",
  "0"
 ],
 [
  "nobody",
  "eq",
  "a user in no business sees no jobs",
  "select count(*) from field_service.jobs",
  "0"
 ],
 [
  "admin",
  "eq",
  "admin sees all three businesses",
  "select count(*) from core.businesses",
  "3"
 ],
 [
  "admin",
  "eq",
  "admin sees appointments from more than one clinic",
  "select count(distinct business_id) >= 2 from medical.appointments",
  "true"
 ],
 [
  "admin",
  "eq",
  "admin sees service jobs",
  "select count(*) > 0 from field_service.jobs",
  "true"
 ],
 [
  "admin",
  "eq",
  "dashboard stats view shows all three businesses to the admin",
  "select count(*) from core.business_stats",
  "3"
 ],
 [
  "admin",
  "error",
  "admin is read-only on tenant records (cannot insert an appointment)",
  "insert into medical.appointments (business_id, location_id, customer_id, visit_type, starts_at) values ('{CLV}', '{CLV_LOC}', '{CLV_CUST}', 'admin write test', now())",
  "42501"
 ]
]$j$;
  t        jsonb;
  v_clv    constant text := 'b0000000-0000-4000-8000-000000000001';
  v_lf     constant text := 'b0000000-0000-4000-8000-000000000002';
  clv_loc  uuid;
  clv_cust uuid;
  lf_loc   uuid;
  clv_appts bigint;
  actor    text;
  cur      text := '';
  kind     text;
  descr    text;
  q        text;
  expected text;
  got      text;
  sub      text;
  passed   boolean;
  detail   text;
  n        int := 0;
  fails    int := 0;
  lines    text[] := '{}';
begin
  -- Facts about the businesses, read before any restricted role is used
  select id into clv_loc  from core.locations where business_id = v_clv::uuid order by created_at, id limit 1;
  select id into clv_cust from core.customers where business_id = v_clv::uuid order by created_at, id limit 1;
  select id into lf_loc   from core.locations where business_id = v_lf::uuid  order by created_at, id limit 1;
  select count(*) into clv_appts from medical.appointments where business_id = v_clv::uuid;

  for t in select value from jsonb_array_elements(tests) loop
    actor    := t->>0;
    kind     := t->>1;
    descr    := t->>2;
    q        := t->>3;
    expected := t->>4;

    q := replace(replace(replace(replace(replace(q,
           '{CLV_LOC}',  clv_loc::text),
           '{CLV_CUST}', clv_cust::text),
           '{LF_LOC}',   lf_loc::text),
           '{CLV}',      v_clv),
           '{LF}',       v_lf);
    expected := replace(expected, '{CLV_APPTS}', clv_appts::text);
    expected := replace(expected, '{LF}', v_lf);

    -- Switch to the user this check runs as
    if actor <> cur then
      execute 'reset role';
      if actor = 'anon' then
        execute 'set local role anon';
      elsif actor <> 'owner' then
        execute 'set local role authenticated';
        sub := case actor
                 when 'customer' then '5c3d8e71-2f94-4b6a-9d05-7e1a4c8b2f36'
                 when 'admin'    then '9a1f0c2e-5b7d-4e3a-8c61-0d2b7f4e9a10'
                 else                 '00000000-0000-4000-8000-0000000000aa'
               end;
        perform set_config('request.jwt.claims',
                           json_build_object('sub', sub, 'role', 'authenticated')::text, true);
        perform set_config('request.jwt.claim.sub', sub, true);
      end if;
      cur := actor;
    end if;

    passed := false;
    detail := '';
    begin
      if kind = 'eq' then
        execute 'select ((' || q || '))::text' into got;
        passed := got is not distinct from expected;
        if not passed then
          detail := 'expected ' || expected || ' but got ' || coalesce(got, 'NULL');
        end if;
      elsif kind = 'error' then
        execute q;
        detail := 'expected error ' || expected || ' but the statement succeeded';
      else  -- 'runs'
        execute q;
        passed := true;
      end if;
    exception when others then
      if kind = 'error' then
        passed := (sqlstate = expected);
        if not passed then
          detail := 'expected error ' || expected || ' but got ' || sqlstate || ': ' || sqlerrm;
        end if;
      else
        passed := false;
        detail := 'unexpected error ' || sqlstate || ': ' || sqlerrm;
      end if;
    end;

    n := n + 1;
    if not passed then fails := fails + 1; end if;
    lines := lines || ((case when passed then 'PASS ' else 'FAIL ' end)
                       || lpad(n::text, 2) || '  ' || descr
                       || (case when passed then '' else E'\n        ' || detail end));
  end loop;

  execute 'reset role';
  raise exception E'\nPASSED % of % checks\n\n%\n\n(This error is expected. It prints the results and rolls everything back.)',
    n - fails, n, array_to_string(lines, E'\n');
end $outer$;