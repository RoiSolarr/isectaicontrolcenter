import { Bell, CalendarPlus, CheckCircle2, Pencil, RefreshCw, UserPlus, type LucideIcon } from 'lucide-react'
import type { OverviewRange } from '@/features/overview/types'

/** Options for the "Last N days" selector on the activity chart. */
export const RANGE_OPTIONS: { value: OverviewRange; label: string }[] = [
  { value: 7, label: 'Last 7 days' },
  { value: 14, label: 'Last 14 days' },
  { value: 30, label: 'Last 30 days' },
]

export const DEFAULT_RANGE: OverviewRange = 7

/** How many rows the Overview previews before sending people to the full pages. */
export const PREVIEW_ROW_LIMIT = 5
export const RECENT_ACTIVITY_LIMIT = 6

/** Series drawn in the activity chart. Colours match the design mockup. */
export const CHART_SERIES = [
  { key: 'appointments', label: 'Appointments', singular: 'appointment', swatch: 'bg-[#4db8a4]' },
  { key: 'jobs', label: 'Jobs', singular: 'job', swatch: 'bg-[#7b9fd0]' },
  { key: 'customers', label: 'New customers', singular: 'new customer', swatch: 'bg-[#e6b768]' },
] as const

/** Icon per `activity_events.event_type`. Unknown types fall back to a bell. */
export const ACTIVITY_ICONS: Record<string, LucideIcon> = {
  appointment_booked: CalendarPlus,
  job_completed: CheckCircle2,
  schedule_synced: RefreshCw,
  customer_added: UserPlus,
  business_updated: Pencil,
}
export const FALLBACK_ACTIVITY_ICON: LucideIcon = Bell

/** Uptime thresholds for an active business. Below `DEGRADED_BELOW` it is "At risk". */
export const UPTIME_OPERATIONAL_MIN = 85
export const UPTIME_DEGRADED_MIN = 70