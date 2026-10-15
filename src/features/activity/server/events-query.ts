import type { ActivityEventItem, ActivityFilters, BusinessLookup } from '@/features/activity/types'
import { getRangeStartIso } from '@/features/activity/utils/range'
import type { createClient } from '@/lib/supabase/server'

export type ServerClient = Awaited<ReturnType<typeof createClient>>

/**
 * The filtered `core.activity_events` query used by both the page and the CSV export,
 * so the two can never disagree about what "matches the filters" means.
 * Callers add their own .order() and .range().
 *
 * `filters.q` was sanitised in utils/parse-filters.ts (no commas, quotes, parentheses or wildcards),
 * and `matchingBusinessIds` are UUIDs read from the database, so neither can break out of the filter string.
 */
export function selectFilteredEvents(supabase: ServerClient, filters: ActivityFilters, matchingBusinessIds: string[], now: Date) {
  let query = supabase
    .schema('core')
    .from('activity_events')
    .select('id, business_id, event_type, title, detail, created_at', { count: 'exact' })

  if (filters.q) {
    const clauses = [`title.ilike.%${filters.q}%`, `detail.ilike.%${filters.q}%`]
    if (matchingBusinessIds.length > 0) clauses.push(`business_id.in.(${matchingBusinessIds.join(',')})`)
    query = query.or(clauses.join(','))
  }
  if (filters.type) query = query.eq('event_type', filters.type)
  if (filters.business) query = query.eq('business_id', filters.business)

  const rangeStart = getRangeStartIso(filters.range, now)
  if (rangeStart) query = query.gte('created_at', rangeStart)

  return query
}

type EventRow = { id: string; business_id: string; event_type: string; title: string; detail: string | null; created_at: string }

/** Database row -> what the UI uses, with the business name and industry type filled in from the lookup. */
export function toEventItem(row: EventRow, lookup: BusinessLookup): ActivityEventItem {
  const business = lookup.byId.get(row.business_id)
  return {
    id: row.id,
    eventType: row.event_type,
    title: row.title,
    detail: row.detail,
    businessId: row.business_id,
    businessName: business?.name ?? null,
    recordType: business?.recordType ?? null,
    createdAt: row.created_at,
  }
}

/** Ids of the businesses whose name contains the search text, so searching "clear" also finds Clearview's events. */
export function findBusinessIdsByName(list: { id: string; name: string }[], q: string): string[] {
  if (!q) return []
  const needle = q.toLowerCase()
  return list.filter((business) => business.name.toLowerCase().includes(needle)).map((business) => business.id)
}