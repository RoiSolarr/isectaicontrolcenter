import { DEFAULT_RANGE, PREVIEW_ROW_LIMIT, RECENT_ACTIVITY_LIMIT } from '@/features/overview/constants'
import type { OverviewBusiness, OverviewData, OverviewRange, OverviewResult } from '@/features/overview/types'
import { buildDailySeries, getRangeStart } from '@/features/overview/utils/daily-series'
import { formatIndustry, getHealthLevel } from '@/features/overview/utils/health'
import { startOfQuarterUtc } from '@/lib/format/dates'
import { percentChange } from '@/lib/format/numbers'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'

const DAY_MS = 86_400_000
/** PostgREST returns at most 1,000 rows per request, so bigger result sets are read page by page. */
const PAGE_SIZE = 1000
const MAX_PAGES = 10
/** The Overview only needs a handful of businesses; this is a safety cap for the prototype. */
const BUSINESS_FETCH_LIMIT = 50

type CreatedAtPage = PromiseLike<{ data: { created_at: string }[] | null; error: { message: string } | null }>

/** Reads every `created_at` returned by a query, one PostgREST page at a time. */
async function fetchAllCreatedAt(fetchPage: (from: number, to: number) => CreatedAtPage): Promise<string[]> {
  const timestamps: string[] = []

  for (let page = 0; page < MAX_PAGES; page++) {
    const from = page * PAGE_SIZE
    const { data, error } = await fetchPage(from, from + PAGE_SIZE - 1)
    if (error) throw new Error(error.message)

    const rows = data ?? []
    for (const row of rows) timestamps.push(row.created_at)
    if (rows.length < PAGE_SIZE) break
  }

  return timestamps
}

/**
 * Everything the Overview page shows, fetched in one parallel round trip.
 * Runs as the signed-in admin, so Row Level Security (is_platform_admin) decides what is visible.
 * Never throws: failures come back as { ok: false, message } so the page can show a friendly error.
 */
export async function getOverviewData(range: OverviewRange = DEFAULT_RANGE): Promise<OverviewResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: 'Supabase is not configured. Add your project URL and anon key to .env.local.' }
  }

  try {
    const supabase = await createClient()
    const core = supabase.schema('core')
    const medical = supabase.schema('medical')
    const fieldService = supabase.schema('field_service')

    const now = new Date()
    const since30 = new Date(now.getTime() - 30 * DAY_MS).toISOString()
    const since60 = new Date(now.getTime() - 60 * DAY_MS).toISOString()
    const rangeStart = getRangeStart(now, range).toISOString()

    const [
      businessesRes,
      activeCountRes,
      quarterCountRes,
      industriesRes,
      statsRes,
      appointmentsTotalRes,
      appointmentsPrevRes,
      jobsTotalRes,
      jobsPrevRes,
      eventsRes,
      appointmentDates,
      jobDates,
      customerDates,
    ] = await Promise.all([
      core
        .from('businesses')
        .select('id, name, city, state, plan, status, uptime_pct, joined_at, industry_id', { count: 'exact' })
        .order('joined_at', { ascending: true })
        .limit(BUSINESS_FETCH_LIMIT),
      core.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      core.from('businesses').select('id', { count: 'exact', head: true }).gte('joined_at', startOfQuarterUtc(now)),
      core.from('industries').select('id, name, sector, record_type'),
      core.from('business_stats').select('business_id, records_30d, open_records'),
      medical.from('appointments').select('id', { count: 'exact', head: true }),
      medical.from('appointments').select('id', { count: 'exact', head: true }).gte('created_at', since60).lt('created_at', since30),
      fieldService.from('jobs').select('id', { count: 'exact', head: true }),
      fieldService.from('jobs').select('id', { count: 'exact', head: true }).gte('created_at', since60).lt('created_at', since30),
      core
        .from('activity_events')
        .select('id, business_id, event_type, title, detail, created_at')
        .order('created_at', { ascending: false })
        .limit(RECENT_ACTIVITY_LIMIT),
      fetchAllCreatedAt((from, to) =>
        medical.from('appointments').select('created_at').gte('created_at', rangeStart).order('created_at').order('id').range(from, to),
      ),
      fetchAllCreatedAt((from, to) =>
        fieldService.from('jobs').select('created_at').gte('created_at', rangeStart).order('created_at').order('id').range(from, to),
      ),
      fetchAllCreatedAt((from, to) =>
        core.from('customers').select('created_at').gte('created_at', rangeStart).order('created_at').order('id').range(from, to),
      ),
    ])

    const firstError = [
      businessesRes,
      activeCountRes,
      quarterCountRes,
      industriesRes,
      statsRes,
      appointmentsTotalRes,
      appointmentsPrevRes,
      jobsTotalRes,
      jobsPrevRes,
      eventsRes,
    ]
      .map((response) => response.error)
      .find(Boolean)
    if (firstError) throw new Error(firstError.message)

    // ---- Businesses --------------------------------------------------------------------------
    const industriesById = new Map((industriesRes.data ?? []).map((industry) => [industry.id, industry]))
    const statsByBusinessId = new Map((statsRes.data ?? []).map((stat) => [stat.business_id, stat]))

    const allBusinesses: OverviewBusiness[] = (businessesRes.data ?? []).map((row) => {
      const industry = industriesById.get(row.industry_id)
      const stats = statsByBusinessId.get(row.id)

      return {
        id: row.id,
        name: row.name,
        city: row.city,
        state: row.state,
        joinedAt: row.joined_at,
        plan: row.plan,
        status: row.status,
        uptimePct: Number(row.uptime_pct),
        health: getHealthLevel(row.status, Number(row.uptime_pct)),
        recordType: industry?.record_type ?? null,
        industryLabel: industry ? formatIndustry(industry.name, industry.sector) : 'Unknown industry',
        records30d: stats?.records_30d ?? 0,
        openRecords: stats?.open_records ?? 0,
      }
    })

    const businessNamesById = new Map(allBusinesses.map((business) => [business.id, business.name]))

    // ---- KPIs --------------------------------------------------------------------------------
    const totalBusinesses = businessesRes.count ?? allBusinesses.length
    const activeBusinesses = activeCountRes.count ?? 0
    const records30d = (statsRes.data ?? []).reduce((sum, stat) => sum + stat.records_30d, 0)
    const recordsPrev30d = (appointmentsPrevRes.count ?? 0) + (jobsPrevRes.count ?? 0)
    const degradedActive = allBusinesses.filter((business) => business.status === 'active' && business.health !== 'operational').length

    const data: OverviewData = {
      range,
      generatedAt: now.toISOString(),
      kpis: {
        totalBusinesses,
        addedThisQuarter: quarterCountRes.count ?? 0,
        latestJoinedAt: allBusinesses.at(-1)?.joinedAt ?? null,
        recordsAllTime: (appointmentsTotalRes.count ?? 0) + (jobsTotalRes.count ?? 0),
        records30d,
        recordsPrev30d,
        changePct: percentChange(records30d, recordsPrev30d),
        openRecords: (statsRes.data ?? []).reduce((sum, stat) => sum + stat.open_records, 0),
        activeBusinesses,
        needAttention: Math.max(totalBusinesses - activeBusinesses, 0) + degradedActive,
      },
      // Oldest member first (matches the directory), and "lowest uptime first" for the health card.
      businesses: allBusinesses.slice(0, PREVIEW_ROW_LIMIT),
      healthRanking: [...allBusinesses]
        .sort((a, b) => a.uptimePct - b.uptimePct || a.name.localeCompare(b.name))
        .slice(0, PREVIEW_ROW_LIMIT),
      activity: (eventsRes.data ?? []).map((event) => ({
        id: event.id,
        eventType: event.event_type,
        title: event.title,
        detail: event.detail,
        businessName: businessNamesById.get(event.business_id) ?? null,
        createdAt: event.created_at,
      })),
      dailyActivity: buildDailySeries({
        now,
        range,
        appointments: appointmentDates,
        jobs: jobDates,
        customers: customerDates,
      }),
    }

    return { ok: true, data }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { ok: false, message }
  }
}