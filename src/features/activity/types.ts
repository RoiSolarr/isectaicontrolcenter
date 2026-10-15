import type { RecordType } from '@/types/database'

/** How far back the log looks. "all" = no lower limit. */
export type ActivityRange = '7d' | '30d' | '90d' | 'all'

/** Everything the Activity page can be filtered by. All of it lives in the URL (?q=…&type=…&business=…&range=…&page=…). */
export type ActivityFilters = {
  /** Free-text search on event title, event detail or business name. */
  q: string
  /** activity_events.event_type, or '' for all types. */
  type: string
  /** businesses.id, or '' for all businesses. */
  business: string
  range: ActivityRange
  page: number
}

export type ActivityEventItem = {
  id: string
  eventType: string
  title: string
  detail: string | null
  businessId: string
  /** null only if the business row is no longer visible. */
  businessName: string | null
  recordType: RecordType | null
  /** ISO timestamp */
  createdAt: string
}

export type BusinessOption = { id: string; name: string }

/** Name + industry type of every business, so events can be shown with a business name without a join. */
export type BusinessLookup = {
  list: BusinessOption[]
  byId: Map<string, { name: string; recordType: RecordType | null }>
}

export type ActivityTypeCount = { type: string; count: number }
export type ActivityBusinessCount = { id: string; name: string; recordType: RecordType | null; count: number }

/** One day of the timeline chart (day = UTC calendar day, like the Overview chart). */
export type ActivityDailyPoint = {
  /** "2026-10-15" */
  date: string
  /** "Thu 15" */
  label: string
  count: number
}

/** Numbers for the KPI cards, the chart, the type chips and the "most active" card. Covers the chosen range + business. */
export type ActivitySummary = {
  total: number
  /** True when there were more events than the safety cap, so the numbers cover the newest ones only. */
  truncated: boolean
  activeBusinesses: number
  totalBusinesses: number
  /** ISO timestamp of the newest event, or null. */
  latestAt: string | null
  /** Most common first. */
  byType: ActivityTypeCount[]
  /** Most active first. */
  byBusiness: ActivityBusinessCount[]
  daily: ActivityDailyPoint[]
  /** Number of days drawn in the chart. */
  chartDays: number
}

export type ActivityData = {
  /** ISO timestamp of when this snapshot was built. */
  generatedAt: string
  events: ActivityEventItem[]
  /** Events matching every filter (what the pagination counts). */
  total: number
  page: number
  pageCount: number
  pageSize: number
  summary: ActivitySummary
  businesses: BusinessOption[]
}