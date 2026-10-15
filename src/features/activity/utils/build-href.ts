import { DEFAULT_RANGE } from '@/features/activity/constants'
import type { ActivityFilters } from '@/features/activity/types'
import { buildQueryString } from '@/features/businesses/utils/query-string'
import { ROUTES } from '@/lib/constants/routes'

/**
 * URL of the Activity page for a set of filters, e.g. "/activity?type=job_completed&page=2".
 * `overrides` change single filters while keeping the rest. Values equal to their default
 * (range "all", page 1) are left out to keep URLs short. `base` lets the export route reuse the same query string.
 */
export function buildActivityHref(filters: ActivityFilters, overrides: Partial<ActivityFilters> = {}, base: string = ROUTES.activity): string {
  const merged = { ...filters, ...overrides }
  return `${base}${buildQueryString(
    { q: merged.q, type: merged.type, business: merged.business, range: merged.range, page: merged.page },
    { range: DEFAULT_RANGE, page: 1 },
  )}`
}