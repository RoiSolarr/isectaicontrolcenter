import { SectionError } from '@/components/shared/section-error'
import { LocationsPanel } from '@/features/businesses/components/locations-panel'
import { RecordsPanel } from '@/features/businesses/components/records-panel'
import { StaffPanel } from '@/features/businesses/components/staff-panel'
import { SummaryPanel } from '@/features/businesses/components/summary-panel'
import { getBusinessSummary } from '@/features/businesses/server/get-business-profile'
import { getBusinessRecords } from '@/features/businesses/server/get-business-records'
import { getBusinessLocations, getBusinessStaff } from '@/features/businesses/server/get-business-people'
import type { BusinessProfile, BusinessTab } from '@/features/businesses/types'
import { parseRecordFilters } from '@/features/businesses/utils/parse-filters'

type BusinessTabContentProps = {
  business: BusinessProfile
  tab: BusinessTab
  searchParams: Record<string, string | string[] | undefined>
}

/** Loads and renders only the tab that is open, so other tabs cost no database queries. */
export async function BusinessTabContent({ business, tab, searchParams }: BusinessTabContentProps) {
  const providerLabel = business.industry.recordType === 'appointment' ? 'Providers' : 'Technicians'

  switch (tab) {
    case 'summary': {
      const result = await getBusinessSummary(business)
      if (!result.ok) return <SectionError title="We couldn’t load the summary." message={result.message} />
      return <SummaryPanel summary={result.data} recordLabel={business.industry.recordLabel} />
    }
    case 'locations': {
      const result = await getBusinessLocations(business.id)
      if (!result.ok) return <SectionError title="We couldn’t load the locations." message={result.message} />
      return <LocationsPanel locations={result.data} />
    }
    case 'staff': {
      const result = await getBusinessStaff(business.id)
      if (!result.ok) return <SectionError title="We couldn’t load the staff." message={result.message} />
      return <StaffPanel staff={result.data} providerLabel={providerLabel} />
    }
    default: {
      const filters = parseRecordFilters(searchParams, business.industry.recordType)
      const result = await getBusinessRecords({ id: business.id, timezone: business.timezone, recordType: business.industry.recordType }, filters)
      if (!result.ok) return <SectionError title={`We couldn’t load the ${business.industry.recordLabel.toLowerCase()}.`} message={result.message} />
      return <RecordsPanel business={business} records={result.data} filters={filters} />
    }
  }
}