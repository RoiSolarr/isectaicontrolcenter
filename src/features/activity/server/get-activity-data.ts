import { ACTIVITY_PAGE_SIZE, SUMMARY_MAX_PAGES, SUMMARY_PAGE_SIZE } from '@/features/activity/constants'
import { findBusinessIdsByName, selectFilteredEvents, toEventItem, type ServerClient } from '@/features/activity/server/events-query'
import { getBusinessLookup } from '@/features/activity/server/get-business-lookup'
import type { ActivityData, ActivityFilters } from '@/features/activity/types'
import { buildSummary, type SummaryRow } from '@/features/activity/utils/build-summary'
import { getChartDays, getRangeStartIso } from '@/features/activity/utils/range'
import type { ServerResult } from '@/features/businesses/types'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'

/** PostgREST error code for "the requested page is past the last row". */
const RANGE_NOT_SATISFIABLE = 'PGRST103'

/**
 * Reads the event rows of the chosen range + business (ignoring search and type) page by page.
 * These rows become the KPI cards, the chart, the type chips and the "most active" card.
 */
async function fetchSummaryRows(supabase: ServerClient, filters: ActivityFilters, now: Date): Promise<{ rows: SummaryRow[]; truncated: boolean }> {
  const rangeStart = getRangeStartIso(filters.range, now)
  const rows: SummaryRow[] = []

  for (let page = 0; page < SUMMARY_MAX_PAGES; page++) {
    const from = page * SUMMARY_PAGE_SIZE

    let query = supabase.schema('core').from('activity_events').select('business_id, event_type, created_at')
    if (rangeStart) query = query.gte('created_at', rangeStart)
    if (filters.business) query = query.eq('business_id', filters.business)

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(from, from + SUMMARY_PAGE_SIZE - 1)
    if (error) throw new Error(error.message)

    const batch = data ?? []
    rows.push(...batch)
    if (batch.length < SUMMARY_PAGE_SIZE) return { rows, truncated: false }
  }

  return { rows, truncated: true }
}

/**
 * Everything the Activity page shows: one filtered page of events plus the summary numbers.
 * Runs as the signed-in admin, so Row Level Security (is_platform_admin) decides what is visible.
 * Never throws: failures come back as { ok: false, message } so the page can show a friendly error.
 */
export async function getActivityData(filters: ActivityFilters): Promise<ServerResult<ActivityData>> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: 'Supabase is not configured. Add your project URL and anon key to .env.local.' }
  }

  try {
    const supabase = await createClient()
    const now = new Date()

    const lookup = await getBusinessLookup(supabase)
    const matchingBusinessIds = findBusinessIdsByName(lookup.list, filters.q)

    const fetchPage = (page: number) => {
      const from = (page - 1) * ACTIVITY_PAGE_SIZE
      return selectFilteredEvents(supabase, filters, matchingBusinessIds, now)
        .order('created_at', { ascending: false })
        .order('id', { ascending: false })
        .range(from, from + ACTIVITY_PAGE_SIZE - 1)
    }

    const [firstTry, summaryRows] = await Promise.all([fetchPage(filters.page), fetchSummaryRows(supabase, filters, now)])

    // Asked for a page that no longer exists (for example after narrowing the filters): show page 1 instead of an error.
    let eventsRes = firstTry
    let page = filters.page
    if (firstTry.error?.code === RANGE_NOT_SATISFIABLE) {
      page = 1
      eventsRes = await fetchPage(1)
    }
    if (eventsRes.error) throw new Error(eventsRes.error.message)

    const events = (eventsRes.data ?? []).map((row) => toEventItem(row, lookup))
    const total = eventsRes.count ?? events.length

    return {
      ok: true,
      data: {
        generatedAt: now.toISOString(),
        events,
        total,
        page,
        pageCount: Math.max(1, Math.ceil(total / ACTIVITY_PAGE_SIZE)),
        pageSize: ACTIVITY_PAGE_SIZE,
        summary: buildSummary({
          rows: summaryRows.rows,
          lookup,
          now,
          chartDays: getChartDays(filters.range),
          truncated: summaryRows.truncated,
        }),
        businesses: lookup.list,
      },
    }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}