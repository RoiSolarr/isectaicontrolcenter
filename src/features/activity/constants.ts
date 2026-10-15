import { Bell, CalendarPlus, CheckCircle2, Pencil, RefreshCw, UserPlus, type LucideIcon } from 'lucide-react'
import type { ActivityRange } from '@/features/activity/types'

export const ACTIVITY_PAGE_SIZE = 20
/** Safety cap for CSV export (PostgREST returns at most 1,000 rows per request). */
export const ACTIVITY_EXPORT_LIMIT = 1000

/** The KPI cards, chart and chips read the events page by page. 5 pages x 1,000 rows is plenty for a prototype. */
export const SUMMARY_PAGE_SIZE = 1000
export const SUMMARY_MAX_PAGES = 5

/** How many businesses the name lookup and the business filter can hold. */
export const BUSINESS_LOOKUP_LIMIT = 200

export const TOP_BUSINESS_LIMIT = 5
/** The timeline never draws more than this many days, even for "90 days" or "All time". */
export const CHART_MAX_DAYS = 30
/** Days drawn when the range is "All time". */
export const CHART_DEFAULT_DAYS = 14

/** How often the "Live" switch re-reads the log. */
export const LIVE_REFRESH_MS = 30_000

/** `days` = how many UTC calendar days (today included) the range covers; null = no limit. */
export const RANGE_OPTIONS: { value: ActivityRange; label: string; days: number | null }[] = [
  { value: '7d', label: 'Last 7 days', days: 7 },
  { value: '30d', label: 'Last 30 days', days: 30 },
  { value: '90d', label: 'Last 90 days', days: 90 },
  { value: 'all', label: 'All time', days: null },
]

export const DEFAULT_RANGE: ActivityRange = 'all'

type EventTypeMeta = {
  label: string
  icon: LucideIcon
  /** Tailwind classes for the round icon tile. */
  tone: string
}

/**
 * Look of each `activity_events.event_type`. Types that are not listed here still work:
 * they get a bell icon and a readable label made from the type name (see utils/event-types.ts).
 */
export const EVENT_TYPE_META: Record<string, EventTypeMeta> = {
  appointment_booked: { label: 'Appointment booked', icon: CalendarPlus, tone: 'bg-teal-50 text-teal-700' },
  job_completed: { label: 'Job completed', icon: CheckCircle2, tone: 'bg-sky-50 text-sky-700' },
  schedule_synced: { label: 'Schedule synced', icon: RefreshCw, tone: 'bg-violet-50 text-violet-700' },
  customer_added: { label: 'Customer added', icon: UserPlus, tone: 'bg-amber-50 text-amber-700' },
  business_updated: { label: 'Business updated', icon: Pencil, tone: 'bg-slate-100 text-slate-700' },
}

export const FALLBACK_EVENT_ICON: LucideIcon = Bell
export const FALLBACK_EVENT_TONE = 'bg-secondary text-muted-foreground'