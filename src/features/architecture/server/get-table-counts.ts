import type { ServerResult } from '@/features/businesses/types'
import type { TableCounts, TableCountsSnapshot } from '@/features/architecture/types'
import { createClient } from '@/lib/supabase/server'

/** Ask Postgres only for the count, not the rows (HEAD request). */
const COUNT_ONLY = { count: 'exact', head: true } as const

/**
 * How many rows each table holds, as seen by the signed-in administrator.
 *
 * Runs with the admin's own session, so Row Level Security applies: the numbers are "rows this user may see".
 * That is deliberate, it shows the database connection and the policies working on the page itself.
 * One failed count (for example a schema that is not exposed) shows as null and does not hide the others;
 * only when every count fails does the caller get { ok: false }.
 */
export async function getTableCounts(): Promise<ServerResult<TableCountsSnapshot>> {
  try {
    const supabase = await createClient()
    const core = supabase.schema('core')

    // One entry per table. The key must match the table name used in content/schema-tables.ts.
    const queries = {
      industries: core.from('industries').select('*', COUNT_ONLY),
      businesses: core.from('businesses').select('*', COUNT_ONLY),
      locations: core.from('locations').select('*', COUNT_ONLY),
      staff: core.from('staff').select('*', COUNT_ONLY),
      customers: core.from('customers').select('*', COUNT_ONLY),
      activity_events: core.from('activity_events').select('*', COUNT_ONLY),
      business_members: core.from('business_members').select('*', COUNT_ONLY),
      platform_admins: core.from('platform_admins').select('*', COUNT_ONLY),
      appointments: supabase.schema('medical').from('appointments').select('*', COUNT_ONLY),
      jobs: supabase.schema('field_service').from('jobs').select('*', COUNT_ONLY),
    }

    const names = Object.keys(queries) as (keyof typeof queries)[]
    const results = await Promise.all(names.map((name) => queries[name]))

    const counts: TableCounts = {}
    let firstError: string | null = null
    names.forEach((name, index) => {
      const { count, error } = results[index]
      counts[name] = error || count === null ? null : count
      if (error && !firstError) firstError = error.message
    })

    if (firstError && Object.values(counts).every((value) => value === null)) throw new Error(firstError)

    return { ok: true, data: { counts, generatedAt: new Date().toISOString() } }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}