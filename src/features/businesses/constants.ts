import type { BusinessPlan, BusinessStatus } from '@/types/database'
import type { RecordWhen } from '@/features/businesses/types'

export const DIRECTORY_PAGE_SIZE = 10
export const RECORDS_PAGE_SIZE = 10
/** Safety cap for CSV export (PostgREST returns at most 1,000 rows per request). */
export const EXPORT_ROW_LIMIT = 1000

export const STATUS_OPTIONS: { value: BusinessStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'paused', label: 'Paused' },
  { value: 'suspended', label: 'Suspended' },
]

export const PLAN_OPTIONS: { value: BusinessPlan; label: string }[] = [
  { value: 'starter', label: 'Starter' },
  { value: 'growth', label: 'Growth' },
  { value: 'professional', label: 'Professional' },
]

export const WHEN_OPTIONS: { value: RecordWhen; label: string }[] = [
  { value: 'all', label: 'All dates' },
  { value: 'today', label: 'Today' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
]

export const APPOINTMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'checked_in', label: 'Checked in' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No-show' },
] as const

export const JOB_STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const

export const DEFAULT_TAB = 'records'