import { cache } from 'react'
import type { BusinessProfile, ServerResult, StatusCount } from '@/features/businesses/types'
import { UUID_PATTERN } from '@/features/businesses/utils/search-term'
import { APPOINTMENT_STATUS_OPTIONS, JOB_STATUS_OPTIONS } from '@/features/businesses/constants'
import type { OverviewActivityEvent } from '@/features/overview/types'
import { formatIndustry, getHealthLevel } from '@/features/overview/utils/health'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'

const RECENT_EVENT_LIMIT = 6

/**
 * One business with its industry, primary location and headline numbers.
 * Resolves to `{ ok: true, data: null }` when the id is malformed or the business does not exist
 * (or Row Level Security hides it), which the page turns into a 404.
 * Wrapped in React `cache` so the page and its metadata share one database round trip.
 */
export const getBusinessProfile = cache(async (id: string): Promise<ServerResult<BusinessProfile | null>> => {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: 'Supabase is not configured. Add your project URL and anon key to .env.local.' }
  }
  if (!UUID_PATTERN.test(id)) return { ok: true, data: null }

  try {
    const supabase = await createClient()
    const core = supabase.schema('core')

    const [businessRes, statsRes, locationRes] = await Promise.all([
      core.from('businesses').select('*').eq('id', id).maybeSingle(),
      core.from('business_stats').select('records_30d, open_records, staff_count, customer_count').eq('business_id', id).maybeSingle(),
      core.from('locations').select('name, address_line, city, state, postal_code').eq('business_id', id).eq('is_primary', true).maybeSingle(),
    ])

    const firstError = [businessRes.error, statsRes.error, locationRes.error].find(Boolean)
    if (firstError) throw new Error(firstError.message)

    const business = businessRes.data
    if (!business) return { ok: true, data: null }

    const industryRes = await core.from('industries').select('name, sector, record_type, record_label').eq('id', business.industry_id).maybeSingle()
    if (industryRes.error) throw new Error(industryRes.error.message)
    const industry = industryRes.data
    if (!industry) throw new Error('This business has no industry assigned.')

    const stats = statsRes.data
    const location = locationRes.data

    return {
      ok: true,
      data: {
        id: business.id,
        tenantCode: business.tenant_code,
        name: business.name,
        legalName: business.legal_name,
        primaryContact: business.primary_contact,
        email: business.email,
        phone: business.phone,
        city: business.city,
        state: business.state,
        timezone: business.timezone,
        plan: business.plan,
        status: business.status,
        uptimePct: Number(business.uptime_pct),
        health: getHealthLevel(business.status, Number(business.uptime_pct)),
        storageUsedGb: Number(business.storage_used_gb),
        storageLimitGb: Number(business.storage_limit_gb),
        joinedAt: business.joined_at,
        industry: {
          name: industry.name,
          sector: industry.sector,
          label: formatIndustry(industry.name, industry.sector),
          recordType: industry.record_type,
          recordLabel: industry.record_label,
        },
        primaryLocation: location
          ? { name: location.name, addressLine: location.address_line, city: location.city, state: location.state, postalCode: location.postal_code }
          : null,
        stats: {
          records30d: stats?.records_30d ?? 0,
          openRecords: stats?.open_records ?? 0,
          staffCount: stats?.staff_count ?? 0,
          customerCount: stats?.customer_count ?? 0,
        },
      },
    }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : 'Unknown error' }
  }
})

export type BusinessSummary = {
  /** How many records sit in each status, in display order (zero counts included). */
  statusCounts: StatusCount[]
  recentActivity: OverviewActivityEvent[]
}

/** Data for the "Summary" tab: records by status + this business's latest activity events. */
export async function getBusinessSummary(business: Pick<BusinessProfile, 'id' | 'name' | 'industry'>): Promise<ServerResult<BusinessSummary>> {
  try {
    const supabase = await createClient()
    const core = supabase.schema('core')

    const countByStatus =
      business.industry.recordType === 'appointment'
        ? APPOINTMENT_STATUS_OPTIONS.map(async ({ value, label }) => {
            const res = await supabase.schema('medical').from('appointments').select('id', { count: 'exact', head: true }).eq('business_id', business.id).eq('status', value)
            if (res.error) throw new Error(res.error.message)
            return { status: label, count: res.count ?? 0 }
          })
        : JOB_STATUS_OPTIONS.map(async ({ value, label }) => {
            const res = await supabase.schema('field_service').from('jobs').select('id', { count: 'exact', head: true }).eq('business_id', business.id).eq('status', value)
            if (res.error) throw new Error(res.error.message)
            return { status: label, count: res.count ?? 0 }
          })

    const [statusCounts, eventsRes] = await Promise.all([
      Promise.all(countByStatus),
      core
        .from('activity_events')
        .select('id, event_type, title, detail, created_at')
        .eq('business_id', business.id)
        .order('created_at', { ascending: false })
        .limit(RECENT_EVENT_LIMIT),
    ])
    if (eventsRes.error) throw new Error(eventsRes.error.message)

    return {
      ok: true,
      data: {
        statusCounts,
        recentActivity: (eventsRes.data ?? []).map((event) => ({
          id: event.id,
          eventType: event.event_type,
          title: event.title,
          detail: event.detail,
          businessName: null,
          createdAt: event.created_at,
        })),
      },
    }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}