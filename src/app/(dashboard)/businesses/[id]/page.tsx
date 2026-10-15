import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { ArrowLeft } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { SectionError } from '@/components/shared/section-error'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BusinessHeaderCard } from '@/features/businesses/components/business-header-card'
import { BusinessProfileCard } from '@/features/businesses/components/business-profile-card'
import { BusinessTabContent } from '@/features/businesses/components/business-tab-content'
import { BusinessTabs } from '@/features/businesses/components/business-tabs'
import { SubscriptionCard } from '@/features/businesses/components/subscription-card'
import { getBusinessProfile } from '@/features/businesses/server/get-business-profile'
import { parseTab } from '@/features/businesses/utils/parse-filters'
import { ROUTES } from '@/lib/constants/routes'

type BusinessPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Pick<BusinessPageProps, 'params'>): Promise<Metadata> {
  const { id } = await params
  const result = await getBusinessProfile(id)
  return { title: result.ok && result.data ? result.data.name : 'Business' }
}

function TabSkeleton() {
  return (
    <div role="status" aria-label="Loading" className="space-y-3">
      <div aria-hidden className="h-6 w-56 animate-pulse rounded-lg bg-border/60" />
      <div aria-hidden className="h-48 animate-pulse rounded-xl bg-border/60" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}

export default async function BusinessPage({ params, searchParams }: BusinessPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams])
  const result = await getBusinessProfile(id)

  if (!result.ok) {
    return (
      <div className="space-y-6">
        <PageHeader eyebrow="Business profile" title="Business" />
        <SectionError title="We couldn’t load this business." message={result.message} />
      </div>
    )
  }
  if (!result.data) notFound()

  const business = result.data
  const tab = parseTab(query)
  // Changing the tab or any filter re-keys Suspense, so the panel shows a skeleton while the header stays put.
  const suspenseKey = JSON.stringify([tab, query])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Business profile"
        title={business.name}
        description="Business profile, tenant status, and industry-specific records."
        actions={
          <Link href={ROUTES.businesses} className={buttonVariants({ variant: 'outline' })}>
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All businesses
          </Link>
        }
      />

      <BusinessHeaderCard business={business} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <BusinessProfileCard business={business} />
        <SubscriptionCard business={business} />
      </div>

      <Card>
        <BusinessTabs
          businessId={business.id}
          active={tab}
          recordLabel={business.industry.recordLabel}
          openRecords={business.stats.openRecords}
          staffCount={business.stats.staffCount}
        />
        <CardContent>
          <Suspense key={suspenseKey} fallback={<TabSkeleton />}>
            <BusinessTabContent business={business} tab={tab} searchParams={query} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}