import { Plus, Wrench, type LucideIcon } from 'lucide-react'

/** Text for the "Multi-business, multi-industry" card on the Security & decisions tab. */

export const INDUSTRY_BADGE = 'Shared core · typed workflows'

export const INDUSTRY_SUMMARY =
  'Every business belongs to an industry. Locations, staff and customers are shared by all industries, so they live once in the core schema. Each industry then gets its own workflow table with its own fields and lifecycle: clinics book appointments, service companies dispatch jobs.'

export const INDUSTRY_WORKFLOWS: { label: string; detail: string; table: string; icon: LucideIcon; tone: string }[] = [
  { label: 'Clinic', detail: 'Appointments · providers', table: 'medical.appointments', icon: Plus, tone: 'bg-emerald-50 text-emerald-700' },
  { label: 'Field service', detail: 'Jobs · technicians', table: 'field_service.jobs', icon: Wrench, tone: 'bg-amber-50 text-amber-700' },
]

export const INDUSTRY_HOW_IT_SHOWS_UP =
  'The dashboard reads record_type and record_label from core.industries, so the same screens say “Appointments” for a clinic and “Service jobs” for a plumber.'

export const ADD_INDUSTRY_STEPS: string[] = [
  'Add a row to core.industries with its sector, record type and label.',
  'If the industry needs a new workflow, add a schema and table that carry business_id, location_id and customer_id, plus the same Row Level Security policies.',
  'Teach the dashboard the new record type: one label and one records panel. Everything else is reused.',
]