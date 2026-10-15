import { formatDayLabel, toUtcDateKey } from '@/lib/format/dates'
import type { DailyActivityPoint, OverviewRange } from '@/features/overview/types'

const DAY_MS = 86_400_000

/** UTC midnight of the first day shown by a chart that ends today. */
export function getRangeStart(now: Date, range: OverviewRange): Date {
  const todayStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return new Date(todayStart - (range - 1) * DAY_MS)
}

function countByDay(timestamps: string[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const timestamp of timestamps) {
    const key = toUtcDateKey(new Date(timestamp))
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return counts
}

type BuildDailySeriesInput = {
  now: Date
  range: OverviewRange
  /** `created_at` timestamps of the rows created inside the range. */
  appointments: string[]
  jobs: string[]
  customers: string[]
}

/** One point per day (oldest first), including days with zero activity so the chart has no gaps. */
export function buildDailySeries({ now, range, appointments, jobs, customers }: BuildDailySeriesInput): DailyActivityPoint[] {
  const start = getRangeStart(now, range).getTime()
  const appointmentCounts = countByDay(appointments)
  const jobCounts = countByDay(jobs)
  const customerCounts = countByDay(customers)

  return Array.from({ length: range }, (_, index) => {
    const date = toUtcDateKey(new Date(start + index * DAY_MS))
    return {
      date,
      label: formatDayLabel(date),
      appointments: appointmentCounts.get(date) ?? 0,
      jobs: jobCounts.get(date) ?? 0,
      customers: customerCounts.get(date) ?? 0,
    }
  })
}