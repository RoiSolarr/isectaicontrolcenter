import type { Metadata } from 'next'
import { AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/shared/page-header'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getAdminSession } from '@/features/auth/server/get-admin-session'
import { BusinessHealthCard } from '@/features/overview/components/business-health-card'
import { BusinessesTable } from '@/features/overview/components/businesses-table'
import { KpiCards } from '@/features/overview/components/kpi-cards'
import { GreetingLine, TodayEyebrow } from '@/features/overview/components/overview-greeting'
import { PlatformActivityChart } from '@/features/overview/components/platform-activity-chart'
import { RecentActivityCard } from '@/features/overview/components/recent-activity-card'
import { RefreshButton } from '@/features/overview/components/refresh-button'
import { getOverviewData } from '@/features/overview/server/get-overview-data'
import { parseRange } from '@/features/overview/utils/parse-range'

export const metadata: Metadata = { title: 'Overview' }

type OverviewPageProps = {
  searchParams: Promise<{ range?: string | string[] }>
}

// Wide card + narrow card, shared by both rows so their edges line up.
const TWO_COLUMN_ROW = 'grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]'

export default async function OverviewPage({ searchParams }: OverviewPageProps) {
  const [{ range: rawRange }, session] = await Promise.all([searchParams, getAdminSession()])
  const result = await getOverviewData(parseRange(rawRange))
  const firstName = session?.admin.full_name.split(' ')[0] ?? 'there'

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={<TodayEyebrow />}
        title="Platform overview"
        description={<GreetingLine firstName={firstName} />}
        actions={result.ok ? <RefreshButton updatedAt={result.data.generatedAt} /> : undefined}
      />

      {result.ok ? (
        <>
          <KpiCards kpis={result.data.kpis} />

          <div className={TWO_COLUMN_ROW}>
            <PlatformActivityChart series={result.data.dailyActivity} range={result.data.range} />
            <BusinessHealthCard businesses={result.data.healthRanking} />
          </div>

          <div className={TWO_COLUMN_ROW}>
            <BusinessesTable businesses={result.data.businesses} totalBusinesses={result.data.kpis.totalBusinesses} />
            <RecentActivityCard events={result.data.activity} />
          </div>
        </>
      ) : (
        <Alert variant="destructive" role="alert">
          <AlertTriangle aria-hidden />
          <AlertTitle>We couldn’t load the platform data.</AlertTitle>
          <AlertDescription>
            {result.message.replace(/\.$/, '')}. Check that the <code>core</code>, <code>medical</code> and <code>field_service</code> schemas exist, are listed
            under Supabase → Project Settings → API → Exposed schemas, and that the migrations and seed data have been applied. Then use
            Refresh to try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}