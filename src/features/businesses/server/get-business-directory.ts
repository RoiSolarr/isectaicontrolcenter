import { DIRECTORY_PAGE_SIZE } from '@/features/businesses/constants'
import type { DirectoryData, DirectoryFilters, DirectoryRow, ServerResult } from '@/features/businesses/types'
import { formatIndustry, getHealthLevel } from '@/features/overview/utils/health'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'

/** PostgREST error code for "the requested page is past the last row". */
const RANGE_NOT_SATISFIABLE = 'PGRST103'

/**
 * Everything the Businesses directory shows: one filtered, paginated page of businesses,
 * the industry options for the filter, and per-business record counts.
 * Runs as the signed-in admin, so Row Level Security decides what is visible.
 */
export async function getBusinessDirectory(filters: DirectoryFilters): Promise<ServerResult<DirectoryData>> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: 'Supabase is not configured. Add your project URL and anon key to .env.local.' }
  }

  try {
    const supabase = await createClient()
    const core = supabase.schema('core')

    const fetchPage = (page: number) => {
      const from = (page - 1) * DIRECTORY_PAGE_SIZE
      let query = core
        .from('businesses')
        .select('id, name, legal_name, city, state, plan, status, uptime_pct, joined_at, industry_id', { count: 'exact' })

      // `q` was sanitised in parse-filters.ts, so it cannot break out of the filter string.
      if (filters.q) query = query.or(`name.ilike.%${filters.q}%,legal_name.ilike.%${filters.q}%,city.ilike.%${filters.q}%`)
      if (filters.industry) query = query.eq('industry_id', filters.industry)
      if (filters.status) query = query.eq('status', filters.status)
      if (filters.plan) query = query.eq('plan', filters.plan)

      return query
        .order('joined_at', { ascending: true })
        .order('name', { ascending: true })
        .range(from, from + DIRECTORY_PAGE_SIZE - 1)
    }

    const [firstTry, industriesRes, totalAllRes] = await Promise.all([
      fetchPage(filters.page),
      core.from('industries').select('id, name, sector, record_type').order('name'),
      core.from('businesses').select('id', { count: 'exact', head: true }),
    ])

    // Asked for a page that no longer exists (for example after filtering): show page 1 instead of an error.
    let businessesRes = firstTry
    let page = filters.page
    if (firstTry.error?.code === RANGE_NOT_SATISFIABLE) {
      page = 1
      businessesRes = await fetchPage(1)
    }

    const firstError = [businessesRes.error, industriesRes.error, totalAllRes.error].find(Boolean)
    if (firstError) throw new Error(firstError.message)

    const businesses = businessesRes.data ?? []
    const industries = industriesRes.data ?? []
    const industriesById = new Map(industries.map((industry) => [industry.id, industry]))

    const ids = businesses.map((business) => business.id)
    const statsRes = ids.length > 0 ? await core.from('business_stats').select('business_id, records_30d, open_records').in('business_id', ids) : null
    if (statsRes?.error) throw new Error(statsRes.error.message)
    const statsById = new Map((statsRes?.data ?? []).map((stat) => [stat.business_id, stat]))

    const rows: DirectoryRow[] = businesses.map((business) => {
      const industry = industriesById.get(business.industry_id)
      const stats = statsById.get(business.id)

      return {
        id: business.id,
        name: business.name,
        legalName: business.legal_name,
        city: business.city,
        state: business.state,
        joinedAt: business.joined_at,
        plan: business.plan,
        status: business.status,
        health: getHealthLevel(business.status, Number(business.uptime_pct)),
        recordType: industry?.record_type ?? null,
        industryLabel: industry ? formatIndustry(industry.name, industry.sector) : 'Unknown industry',
        records30d: stats?.records_30d ?? 0,
        openRecords: stats?.open_records ?? 0,
      }
    })

    const total = businessesRes.count ?? rows.length

    return {
      ok: true,
      data: {
        rows,
        total,
        totalAll: totalAllRes.count ?? total,
        page,
        pageCount: Math.max(1, Math.ceil(total / DIRECTORY_PAGE_SIZE)),
        pageSize: DIRECTORY_PAGE_SIZE,
        industries: industries.map((industry) => ({ id: industry.id, label: formatIndustry(industry.name, industry.sector) })),
      },
    }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}