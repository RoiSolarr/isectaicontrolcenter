import { DEFAULT_RANGE, RANGE_OPTIONS } from '@/features/activity/constants'
import type { ActivityFilters } from '@/features/activity/types'
import { firstParam } from '@/features/businesses/utils/query-string'
import { UUID_PATTERN, sanitizeSearchTerm } from '@/features/businesses/utils/search-term'

type SearchParams = Record<string, string | string[] | undefined>

/** Event types are short snake_case words ("appointment_booked"). Anything else is ignored. */
const EVENT_TYPE_PATTERN = /^[a-z0-9_]{1,40}$/

function parsePage(raw: string): number {
  const page = Number.parseInt(raw, 10)
  return Number.isFinite(page) && page >= 1 ? Math.min(page, 10_000) : 1
}

/** Turns /activity?... into safe, validated filters. Unknown or malformed values fall back to "no filter". */
export function parseActivityFilters(params: SearchParams): ActivityFilters {
  const type = firstParam(params.type)
  const business = firstParam(params.business)
  const range = firstParam(params.range)

  return {
    q: sanitizeSearchTerm(firstParam(params.q)),
    type: EVENT_TYPE_PATTERN.test(type) ? type : '',
    business: UUID_PATTERN.test(business) ? business : '',
    range: RANGE_OPTIONS.find((option) => option.value === range)?.value ?? DEFAULT_RANGE,
    page: parsePage(firstParam(params.page)),
  }
}

/** True when any filter narrows the log (used to choose between "no activity yet" and "nothing matches"). */
export function hasActiveFilters(filters: ActivityFilters): boolean {
  return Boolean(filters.q || filters.type || filters.business || filters.range !== DEFAULT_RANGE)
}