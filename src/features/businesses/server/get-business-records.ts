import { EXPORT_ROW_LIMIT, RECORDS_PAGE_SIZE } from '@/features/businesses/constants'
import type { AppointmentListItem, BusinessProfile, JobListItem, RecordFilters, RecordsPage, ServerResult } from '@/features/businesses/types'
import { zonedDayRange } from '@/features/businesses/utils/time-zone'
import { createClient } from '@/lib/supabase/server'

const RANGE_NOT_SATISFIABLE = 'PGRST103'
const SEARCH_CUSTOMER_LIMIT = 50

type Supabase = Awaited<ReturnType<typeof createClient>>
type RecordsTarget = Pick<BusinessProfile, 'id' | 'timezone'> & { recordType: 'appointment' | 'job' }
type Options = { /** true = one big page for CSV export */ forExport?: boolean }

type DateWindow = { from?: string; before?: string; ascending: boolean }

/** Turns the "when" filter into a date window, judged in the business's own time zone. */
function getDateWindow(when: RecordFilters['when'], timeZone: string): DateWindow {
  const { start, end } = zonedDayRange(new Date(), timeZone)
  switch (when) {
    case 'today':
      return { from: start.toISOString(), before: end.toISOString(), ascending: true }
    case 'upcoming':
      return { from: end.toISOString(), ascending: true }
    case 'past':
      return { before: start.toISOString(), ascending: false }
    default:
      return { ascending: false }
  }
}

/** Customer ids (of this business only) whose name matches the search text. */
async function findCustomerIds(supabase: Supabase, businessId: string, term: string): Promise<string[]> {
  if (!term) return []
  const { data, error } = await supabase
    .schema('core')
    .from('customers')
    .select('id')
    .eq('business_id', businessId)
    .ilike('display_name', `%${term}%`)
    .limit(SEARCH_CUSTOMER_LIMIT)
  if (error) throw new Error(error.message)
  return (data ?? []).map((customer) => customer.id)
}

/** id -> name lookups for the people and places shown in one page of records. */
async function loadNames(supabase: Supabase, businessId: string, customerIds: string[], staffIds: string[]) {
  const core = supabase.schema('core')
  const [customersRes, staffRes, locationsRes] = await Promise.all([
    customerIds.length > 0 ? core.from('customers').select('id, display_name').eq('business_id', businessId).in('id', customerIds) : null,
    staffIds.length > 0 ? core.from('staff').select('id, full_name').eq('business_id', businessId).in('id', staffIds) : null,
    core.from('locations').select('id, name').eq('business_id', businessId),
  ])
  const firstError = [customersRes?.error, staffRes?.error, locationsRes.error].find(Boolean)
  if (firstError) throw new Error(firstError.message)

  return {
    customers: new Map((customersRes?.data ?? []).map((row) => [row.id, row.display_name])),
    staff: new Map((staffRes?.data ?? []).map((row) => [row.id, row.full_name])),
    locations: new Map((locationsRes.data ?? []).map((row) => [row.id, row.name])),
  }
}

function pageInfo(total: number, page: number, pageSize: number) {
  return { total, page, pageSize, pageCount: Math.max(1, Math.ceil(total / pageSize)) }
}

async function getAppointments(supabase: Supabase, business: RecordsTarget, filters: RecordFilters, options: Options): Promise<RecordsPage> {
  const window = getDateWindow(filters.when, business.timezone)
  const customerIds = await findCustomerIds(supabase, business.id, filters.q)
  const pageSize = options.forExport ? EXPORT_ROW_LIMIT : RECORDS_PAGE_SIZE

  const fetchPage = (page: number) => {
    const from = options.forExport ? 0 : (page - 1) * pageSize
    let query = supabase
      .schema('medical')
      .from('appointments')
      .select('id, customer_id, provider_id, location_id, visit_type, starts_at, status', { count: 'exact' })
      .eq('business_id', business.id)

    if (window.from) query = query.gte('starts_at', window.from)
    if (window.before) query = query.lt('starts_at', window.before)
    if (filters.status) query = query.eq('status', filters.status as AppointmentListItem['status'])
    if (filters.q) {
      const customerClause = customerIds.length > 0 ? `,customer_id.in.(${customerIds.join(',')})` : ''
      query = query.or(`visit_type.ilike.%${filters.q}%${customerClause}`)
    }

    return query.order('starts_at', { ascending: window.ascending }).range(from, from + pageSize - 1)
  }

  let page = filters.page
  let res = await fetchPage(page)
  if (res.error?.code === RANGE_NOT_SATISFIABLE) {
    page = 1
    res = await fetchPage(1)
  }
  if (res.error) throw new Error(res.error.message)

  const data = res.data ?? []
  const names = await loadNames(
    supabase,
    business.id,
    data.map((row) => row.customer_id),
    data.flatMap((row) => (row.provider_id ? [row.provider_id] : [])),
  )

  const rows: AppointmentListItem[] = data.map((row) => ({
    id: row.id,
    customerName: names.customers.get(row.customer_id) ?? 'Unknown customer',
    visitType: row.visit_type,
    providerName: row.provider_id ? (names.staff.get(row.provider_id) ?? null) : null,
    locationName: names.locations.get(row.location_id) ?? null,
    startsAt: row.starts_at,
    status: row.status,
  }))

  return { kind: 'appointment', rows, ...pageInfo(res.count ?? rows.length, page, pageSize) }
}

async function getJobs(supabase: Supabase, business: RecordsTarget, filters: RecordFilters, options: Options): Promise<RecordsPage> {
  const window = getDateWindow(filters.when, business.timezone)
  const customerIds = await findCustomerIds(supabase, business.id, filters.q)
  const pageSize = options.forExport ? EXPORT_ROW_LIMIT : RECORDS_PAGE_SIZE

  const fetchPage = (page: number) => {
    const from = options.forExport ? 0 : (page - 1) * pageSize
    let query = supabase
      .schema('field_service')
      .from('jobs')
      .select('id, customer_id, technician_id, location_id, service_type, service_address, scheduled_at, status', { count: 'exact' })
      .eq('business_id', business.id)

    if (window.from) query = query.gte('scheduled_at', window.from)
    if (window.before) query = query.lt('scheduled_at', window.before)
    if (filters.status) query = query.eq('status', filters.status as JobListItem['status'])
    if (filters.q) {
      const customerClause = customerIds.length > 0 ? `,customer_id.in.(${customerIds.join(',')})` : ''
      query = query.or(`service_type.ilike.%${filters.q}%,service_address.ilike.%${filters.q}%${customerClause}`)
    }

    return query.order('scheduled_at', { ascending: window.ascending }).range(from, from + pageSize - 1)
  }

  let page = filters.page
  let res = await fetchPage(page)
  if (res.error?.code === RANGE_NOT_SATISFIABLE) {
    page = 1
    res = await fetchPage(1)
  }
  if (res.error) throw new Error(res.error.message)

  const data = res.data ?? []
  const names = await loadNames(
    supabase,
    business.id,
    data.map((row) => row.customer_id),
    data.flatMap((row) => (row.technician_id ? [row.technician_id] : [])),
  )

  const rows: JobListItem[] = data.map((row) => ({
    id: row.id,
    customerName: names.customers.get(row.customer_id) ?? 'Unknown customer',
    serviceType: row.service_type,
    serviceAddress: row.service_address,
    technicianName: row.technician_id ? (names.staff.get(row.technician_id) ?? null) : null,
    locationName: names.locations.get(row.location_id) ?? null,
    scheduledAt: row.scheduled_at,
    status: row.status,
  }))

  return { kind: 'job', rows, ...pageInfo(res.count ?? rows.length, page, pageSize) }
}

/**
 * The business-specific records: appointments for clinics, service jobs for field-service companies.
 * The industry's `record_type` decides which table is read. Every query is filtered by business_id,
 * and Row Level Security enforces the same rule inside Postgres.
 */
export async function getBusinessRecords(business: RecordsTarget, filters: RecordFilters, options: Options = {}): Promise<ServerResult<RecordsPage>> {
  try {
    const supabase = await createClient()
    const data =
      business.recordType === 'appointment'
        ? await getAppointments(supabase, business, filters, options)
        : await getJobs(supabase, business, filters, options)
    return { ok: true, data }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}