import type { AppointmentStatus, JobStatus } from '@/types/database'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand'
type Meta = { label: string; badge: BadgeVariant }

export const APPOINTMENT_STATUS_META: Record<AppointmentStatus, Meta> = {
  pending: { label: 'Pending', badge: 'warning' },
  confirmed: { label: 'Confirmed', badge: 'success' },
  checked_in: { label: 'Checked in', badge: 'info' },
  completed: { label: 'Completed', badge: 'brand' },
  cancelled: { label: 'Cancelled', badge: 'neutral' },
  no_show: { label: 'No-show', badge: 'danger' },
}

export const JOB_STATUS_META: Record<JobStatus, Meta> = {
  scheduled: { label: 'Scheduled', badge: 'warning' },
  in_progress: { label: 'In progress', badge: 'info' },
  completed: { label: 'Completed', badge: 'brand' },
  cancelled: { label: 'Cancelled', badge: 'neutral' },
}