import { SectionLoadingLink } from '@/components/shared/section-loading'
import { Badge } from '@/components/ui/badge'
import { DEFAULT_TAB } from '@/features/businesses/constants'
import type { BusinessTab } from '@/features/businesses/types'
import { buildQueryString } from '@/features/businesses/utils/query-string'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils'

type BusinessTabsProps = {
  businessId: string
  active: BusinessTab
  /** "Appointments" or "Service jobs", depending on the industry. */
  recordLabel: string
  openRecords: number
  staffCount: number
}

/** Tab bar for the business page. Each tab is a real link (?tab=staff), so it works without JavaScript and can be shared. */
export function BusinessTabs({ businessId, active, recordLabel, openRecords, staffCount }: BusinessTabsProps) {
  const tabs: { id: BusinessTab; label: string; badge?: string }[] = [
    { id: 'records', label: recordLabel, badge: `${openRecords} open` },
    { id: 'summary', label: 'Summary' },
    { id: 'locations', label: 'Locations' },
    { id: 'staff', label: 'Staff', badge: String(staffCount) },
  ]

  return (
    <nav aria-label="Business sections" className="border-b border-border px-5 sm:px-6">
      <ul className="-mb-px flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = tab.id === active
          return (
            <li key={tab.id} className="shrink-0">
              <SectionLoadingLink
                href={`${ROUTES.businesses}/${businessId}${buildQueryString({ tab: tab.id }, { tab: DEFAULT_TAB })}`}
                scroll={false}
                loadingLabel={`Loading ${tab.label}…`}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 border-b-2 px-3 py-3.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                {tab.label}
                {tab.badge ? <Badge variant="neutral">{tab.badge}</Badge> : null}
              </SectionLoadingLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}