import { ACTIVITY_EXPORT_LIMIT } from '@/features/activity/constants'
import { findBusinessIdsByName, selectFilteredEvents, toEventItem } from '@/features/activity/server/events-query'
import { getBusinessLookup } from '@/features/activity/server/get-business-lookup'
import type { ActivityEventItem, ActivityFilters } from '@/features/activity/types'
import type { ServerResult } from '@/features/businesses/types'
import { isSupabaseConfigured } from '@/lib/supabase/env'
import { createClient } from '@/lib/supabase/server'

/** The newest events matching the filters (every page, capped at ACTIVITY_EXPORT_LIMIT) for the CSV download. */
export async function getActivityExport(filters: ActivityFilters): Promise<ServerResult<ActivityEventItem[]>> {
  if (!isSupabaseConfigured()) {
    return { ok: false, message: 'Supabase is not configured. Add your project URL and anon key to .env.local.' }
  }

  try {
    const supabase = await createClient()
    const lookup = await getBusinessLookup(supabase)

    const { data, error } = await selectFilteredEvents(supabase, filters, findBusinessIdsByName(lookup.list, filters.q), new Date())
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .limit(ACTIVITY_EXPORT_LIMIT)
    if (error) throw new Error(error.message)

    return {
      ok: true,
      data: (data ?? []).map((row) => toEventItem(row, lookup)),
    }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}