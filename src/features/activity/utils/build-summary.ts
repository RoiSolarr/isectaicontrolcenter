import { TOP_BUSINESS_LIMIT } from '@/features/activity/constants'
import type { ActivityDailyPoint, ActivitySummary, BusinessLookup } from '@/features/activity/types'
import { getEventMeta } from '@/features/activity/utils/event-types'
import { formatDayLabel, toUtcDateKey } from '@/lib/format/dates'

const DAY_MS = 86_400_000

export type SummaryRow = { business_id: string; event_type: string; created_at: string }

/** One point per UTC day, oldest first, ending today. Days without events are included so the chart has no gaps. */
export function buildEventSeries(timestamps: string[], now: Date, days: number): ActivityDailyPoint[] {
  const counts = new Map<string, number>()
  for (const timestamp of timestamps) {
    const key = toUtcDateKey(new Date(timestamp))
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const todayStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return Array.from({ length: days }, (_, index) => {
    const date = toUtcDateKey(new Date(todayStart - (days - 1 - index) * DAY_MS))
    return { date, label: formatDayLabel(date), count: counts.get(date) ?? 0 }
  })
}

type BuildSummaryInput = {
  rows: SummaryRow[]
  lookup: BusinessLookup
  now: Date
  chartDays: number
  truncated: boolean
}

/** Turns the raw event rows of the chosen range into every number the Activity page shows above the log. */
export function buildSummary({ rows, lookup, now, chartDays, truncated }: BuildSummaryInput): ActivitySummary {
  const typeCounts = new Map<string, number>()
  const businessCounts = new Map<string, number>()
  let latestMs = 0

  for (const row of rows) {
    typeCounts.set(row.event_type, (typeCounts.get(row.event_type) ?? 0) + 1)
    businessCounts.set(row.business_id, (businessCounts.get(row.business_id) ?? 0) + 1)
    const time = new Date(row.created_at).getTime()
    if (time > latestMs) latestMs = time
  }

  const byType = [...typeCounts.entries()]
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count || getEventMeta(a.type).label.localeCompare(getEventMeta(b.type).label))

  const byBusiness = [...businessCounts.entries()]
    .map(([id, count]) => {
      const business = lookup.byId.get(id)
      return { id, name: business?.name ?? 'Unknown business', recordType: business?.recordType ?? null, count }
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, TOP_BUSINESS_LIMIT)

  return {
    total: rows.length,
    truncated,
    activeBusinesses: businessCounts.size,
    totalBusinesses: lookup.list.length,
    latestAt: latestMs > 0 ? new Date(latestMs).toISOString() : null,
    byType,
    byBusiness,
    daily: buildEventSeries(
      rows.map((row) => row.created_at),
      now,
      chartDays,
    ),
    chartDays,
  }
}