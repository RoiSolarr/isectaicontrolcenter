import type { BusinessPlan, BusinessStatus, RecordType } from '@/types/database'

/** Number of days the "Platform activity" chart covers. */
export type OverviewRange = 7 | 14 | 30

export type HealthLevel = 'operational' | 'degraded' | 'at_risk' | 'onboarding' | 'paused' | 'suspended'

/** One day of the activity chart (day = UTC calendar day). */
export type DailyActivityPoint = {
  /** "2026-10-15" */
  date: string
  /** "Thu 15" */
  label: string
  appointments: number
  jobs: number
  customers: number
}

export type OverviewKpis = {
  totalBusinesses: number
  addedThisQuarter: number
  /** Most recent `joined_at` among all businesses ("2026-05-22"), or null if there are none. */
  latestJoinedAt: string | null
  /** Appointments + jobs, all time. */
  recordsAllTime: number
  /** Appointments + jobs created in the last 30 days. */
  records30d: number
  /** Appointments + jobs created 30-60 days ago (comparison period). */
  recordsPrev30d: number
  /** Percent change vs the previous 30 days, or null when there is nothing to compare with. */
  changePct: number | null
  openRecords: number
  activeBusinesses: number
  /** Businesses that are not active, or active with degraded uptime. */
  needAttention: number
}

export type OverviewBusiness = {
  id: string
  name: string
  city: string
  state: string
  joinedAt: string
  plan: BusinessPlan
  status: BusinessStatus
  uptimePct: number
  health: HealthLevel
  recordType: RecordType | null
  industryLabel: string
  records30d: number
  openRecords: number
}

export type OverviewActivityEvent = {
  id: string
  eventType: string
  title: string
  detail: string | null
  businessName: string | null
  /** ISO timestamp */
  createdAt: string
}

export type OverviewData = {
  range: OverviewRange
  /** ISO timestamp of when this snapshot was built. */
  generatedAt: string
  kpis: OverviewKpis
  /** Businesses for the directory preview, oldest member first. */
  businesses: OverviewBusiness[]
  /** Businesses for the health card, lowest uptime first. */
  healthRanking: OverviewBusiness[]
  activity: OverviewActivityEvent[]
  dailyActivity: DailyActivityPoint[]
}

export type OverviewResult = { ok: true; data: OverviewData } | { ok: false; message: string }