import type { HealthLevel } from '@/features/overview/types'
import type { AppointmentStatus, BusinessPlan, BusinessStatus, JobStatus, RecordType } from '@/types/database'

/** Every server function here returns this instead of throwing, so pages can show a friendly error. */
export type ServerResult<T> = { ok: true; data: T } | { ok: false; message: string }

// ---- Directory (/businesses) ---------------------------------------------------------------

export type DirectoryFilters = {
  /** Free-text search on business name, legal name or city. */
  q: string
  /** industries.id, or '' for all. */
  industry: string
  status: BusinessStatus | ''
  plan: BusinessPlan | ''
  page: number
}

export type IndustryOption = { id: string; label: string }

export type DirectoryRow = {
  id: string
  name: string
  legalName: string
  city: string
  state: string
  joinedAt: string
  plan: BusinessPlan
  status: BusinessStatus
  health: HealthLevel
  recordType: RecordType | null
  industryLabel: string
  records30d: number
  openRecords: number
}

export type DirectoryData = {
  rows: DirectoryRow[]
  /** Rows matching the current filters. */
  total: number
  /** Rows on the platform regardless of filters. */
  totalAll: number
  page: number
  pageCount: number
  pageSize: number
  industries: IndustryOption[]
}

// ---- Business profile (/businesses/[id]) ---------------------------------------------------

export type BusinessTab = 'records' | 'summary' | 'locations' | 'staff'

export type BusinessProfile = {
  id: string
  tenantCode: string
  name: string
  legalName: string
  primaryContact: string
  email: string
  phone: string
  city: string
  state: string
  timezone: string
  plan: BusinessPlan
  status: BusinessStatus
  uptimePct: number
  health: HealthLevel
  storageUsedGb: number
  storageLimitGb: number
  joinedAt: string
  industry: {
    name: string
    sector: string
    label: string
    recordType: RecordType
    /** "Appointments" or "Service jobs" */
    recordLabel: string
  }
  primaryLocation: { name: string; addressLine: string; city: string; state: string; postalCode: string } | null
  stats: { records30d: number; openRecords: number; staffCount: number; customerCount: number }
}

// ---- Business-specific records -------------------------------------------------------------

export type RecordWhen = 'all' | 'today' | 'upcoming' | 'past'

export type RecordFilters = {
  q: string
  when: RecordWhen
  /** An appointment or job status, or '' for all. */
  status: string
  page: number
}

export type AppointmentListItem = {
  id: string
  customerName: string
  visitType: string
  providerName: string | null
  locationName: string | null
  startsAt: string
  status: AppointmentStatus
}

export type JobListItem = {
  id: string
  customerName: string
  serviceType: string
  serviceAddress: string
  technicianName: string | null
  locationName: string | null
  scheduledAt: string
  status: JobStatus
}

type PageInfo = { total: number; page: number; pageCount: number; pageSize: number }

export type RecordsPage =
  | ({ kind: 'appointment'; rows: AppointmentListItem[] } & PageInfo)
  | ({ kind: 'job'; rows: JobListItem[] } & PageInfo)

// ---- Summary / people tabs -----------------------------------------------------------------

export type StatusCount = { status: string; count: number }

export type BusinessLocation = {
  id: string
  name: string
  addressLine: string
  city: string
  state: string
  postalCode: string
  isPrimary: boolean
}

export type BusinessStaffMember = {
  id: string
  fullName: string
  role: string
  locationName: string | null
  isProvider: boolean
  isActive: boolean
}