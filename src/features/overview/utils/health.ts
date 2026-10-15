import { UPTIME_DEGRADED_MIN, UPTIME_OPERATIONAL_MIN } from '@/features/overview/constants'
import type { HealthLevel } from '@/features/overview/types'
import type { BusinessStatus } from '@/types/database'

/** Business lifecycle status wins; uptime only matters for active businesses. */
export function getHealthLevel(status: BusinessStatus, uptimePct: number): HealthLevel {
  if (status === 'onboarding') return 'onboarding'
  if (status === 'paused') return 'paused'
  if (status === 'suspended') return 'suspended'
  if (uptimePct >= UPTIME_OPERATIONAL_MIN) return 'operational'
  if (uptimePct >= UPTIME_DEGRADED_MIN) return 'degraded'
  return 'at_risk'
}

type HealthMeta = {
  label: string
  badge: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  /** Tailwind class for the progress-bar fill. */
  bar: string
}

export const HEALTH_META: Record<HealthLevel, HealthMeta> = {
  operational: { label: 'Operational', badge: 'success', bar: 'bg-emerald-500' },
  degraded: { label: 'Degraded', badge: 'warning', bar: 'bg-amber-500' },
  at_risk: { label: 'At risk', badge: 'danger', bar: 'bg-red-500' },
  onboarding: { label: 'Onboarding', badge: 'info', bar: 'bg-sky-500' },
  paused: { label: 'Paused', badge: 'warning', bar: 'bg-amber-500' },
  suspended: { label: 'Suspended', badge: 'danger', bar: 'bg-red-500' },
}

/** "Medical clinic" stays as is; other sectors read "Home services · Plumbing". */
export function formatIndustry(name: string, sector: string): string {
  return sector === 'Healthcare' ? name : `${sector} · ${name}`
}

type StatusMeta = { label: string; badge: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }

/** Badge look for the business lifecycle status shown in tables. */
export const STATUS_META: Record<BusinessStatus, StatusMeta> = {
  active: { label: 'Active', badge: 'success' },
  onboarding: { label: 'Onboarding', badge: 'info' },
  paused: { label: 'Paused', badge: 'warning' },
  suspended: { label: 'Suspended', badge: 'danger' },
}