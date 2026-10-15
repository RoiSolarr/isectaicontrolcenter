import { CHART_DEFAULT_DAYS, CHART_MAX_DAYS, RANGE_OPTIONS } from '@/features/activity/constants'
import type { ActivityRange } from '@/features/activity/types'

const DAY_MS = 86_400_000

/** Number of UTC calendar days (today included) a range covers, or null for "all time". */
export function getRangeDays(range: ActivityRange): number | null {
  return RANGE_OPTIONS.find((option) => option.value === range)?.days ?? null
}

/**
 * ISO timestamp of UTC midnight on the first day of the range, or null for "all time".
 * Same rule as the Overview chart: "Last 7 days" = today and the 6 days before it, in UTC.
 */
export function getRangeStartIso(range: ActivityRange, now: Date): string | null {
  const days = getRangeDays(range)
  if (days === null) return null
  const todayStart = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return new Date(todayStart - (days - 1) * DAY_MS).toISOString()
}

/** How many bars the timeline draws: the range itself, but never more than CHART_MAX_DAYS. */
export function getChartDays(range: ActivityRange): number {
  const days = getRangeDays(range)
  return days === null ? CHART_DEFAULT_DAYS : Math.min(days, CHART_MAX_DAYS)
}

/** "in the last 30 days" / "all time" — used in card captions. */
export function describeRange(range: ActivityRange): string {
  const days = getRangeDays(range)
  return days === null ? 'all time' : `in the last ${days} days`
}