-- =============================================================================
-- Read-only views used by the admin dashboard.
--
-- security_invoker = true makes the view run with the CALLER's permissions, so
-- Row Level Security still applies. (A plain view would run as its owner and
-- silently bypass RLS.)
-- =============================================================================

create or replace view core.business_stats
with (security_invoker = true) as
select
  b.id as business_id,
  coalesce(a.records_30d, 0) + coalesce(j.records_30d, 0) as records_30d,
  coalesce(a.open_records, 0) + coalesce(j.open_records, 0) as open_records,
  (select count(*) from core.staff s where s.business_id = b.id and s.is_active) as staff_count,
  (select count(*) from core.customers c where c.business_id = b.id) as customer_count
from core.businesses b
left join (
  select
    business_id,
    count(*) filter (where created_at >= now() - interval '30 days') as records_30d,
    count(*) filter (where status in ('pending', 'confirmed', 'checked_in')) as open_records
  from medical.appointments
  group by business_id
) a on a.business_id = b.id
left join (
  select
    business_id,
    count(*) filter (where created_at >= now() - interval '30 days') as records_30d,
    count(*) filter (where status in ('scheduled', 'in_progress')) as open_records
  from field_service.jobs
  group by business_id
) j on j.business_id = b.id;

grant select on core.business_stats to authenticated;