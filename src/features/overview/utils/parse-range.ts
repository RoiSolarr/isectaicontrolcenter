import { DEFAULT_RANGE, RANGE_OPTIONS } from '@/features/overview/constants'
import type { OverviewRange } from '@/features/overview/types'

/** Turns the `?range=` URL value into a valid range. Anything unexpected falls back to the default. */
export function parseRange(value: string | string[] | undefined): OverviewRange {
  const raw = Array.isArray(value) ? value[0] : value
  const match = RANGE_OPTIONS.find((option) => String(option.value) === raw)
  return match ? match.value : DEFAULT_RANGE
}