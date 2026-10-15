import {
  APPOINTMENT_STATUS_OPTIONS,
  JOB_STATUS_OPTIONS,
  PLAN_OPTIONS,
  STATUS_OPTIONS,
  WHEN_OPTIONS,
  DEFAULT_TAB,
} from '@/features/businesses/constants'
import type { BusinessTab, DirectoryFilters, RecordFilters } from '@/features/businesses/types'
import { firstParam } from '@/features/businesses/utils/query-string'
import { UUID_PATTERN, sanitizeSearchTerm } from '@/features/businesses/utils/search-term'
import type { RecordType } from '@/types/database'

type SearchParams = Record<string, string | string[] | undefined>

function parsePage(raw: string): number {
  const page = Number.parseInt(raw, 10)
  return Number.isFinite(page) && page >= 1 ? Math.min(page, 10_000) : 1
}

/** Turns /businesses?... into safe, validated filters. Unknown values fall back to "no filter". */
export function parseDirectoryFilters(params: SearchParams): DirectoryFilters {
  const status = firstParam(params.status)
  const plan = firstParam(params.plan)
  const industry = firstParam(params.industry)

  return {
    q: sanitizeSearchTerm(firstParam(params.q)),
    industry: UUID_PATTERN.test(industry) ? industry : '',
    status: STATUS_OPTIONS.find((option) => option.value === status)?.value ?? '',
    plan: PLAN_OPTIONS.find((option) => option.value === plan)?.value ?? '',
    page: parsePage(firstParam(params.page)),
  }
}

const TABS: BusinessTab[] = ['records', 'summary', 'locations', 'staff']

export function parseTab(params: SearchParams): BusinessTab {
  const tab = firstParam(params.tab)
  return TABS.find((candidate) => candidate === tab) ?? DEFAULT_TAB
}

/** Record filters for the business page; the allowed statuses depend on the industry's record type. */
export function parseRecordFilters(params: SearchParams, recordType: RecordType): RecordFilters {
  const when = firstParam(params.when)
  const status = firstParam(params.status)
  const statusOptions = recordType === 'appointment' ? APPOINTMENT_STATUS_OPTIONS : JOB_STATUS_OPTIONS

  return {
    q: sanitizeSearchTerm(firstParam(params.q)),
    when: WHEN_OPTIONS.find((option) => option.value === when)?.value ?? 'all',
    status: statusOptions.find((option) => option.value === status)?.value ?? '',
    page: parsePage(firstParam(params.page)),
  }
}