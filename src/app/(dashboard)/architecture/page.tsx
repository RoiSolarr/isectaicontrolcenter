import type { Metadata } from 'next'
import { PageHeader } from '@/components/shared/page-header'
import { ArchitectureTabs } from '@/features/architecture/components/architecture-tabs'
import { DatabaseView } from '@/features/architecture/components/database-view'
import { SecurityView } from '@/features/architecture/components/security-view'
import { VIEW_HEADERS } from '@/features/architecture/constants'
import { getTableCounts } from '@/features/architecture/server/get-table-counts'
import { parseArchitectureView } from '@/features/architecture/utils/parse-view'
import { RefreshButton } from '@/features/overview/components/refresh-button'

export const metadata: Metadata = { title: 'Architecture' }

type ArchitecturePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function ArchitecturePage({ searchParams }: ArchitecturePageProps) {
  const view = parseArchitectureView((await searchParams).view)
  const header = VIEW_HEADERS[view]

  // Only the Database tab reads from the database (live row counts); the Security tab is all text.
  const counts = view === 'database' ? await getTableCounts() : null

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={header.eyebrow}
        title={header.title}
        description={header.description}
        actions={counts ? <RefreshButton updatedAt={counts.ok ? counts.data.generatedAt : new Date().toISOString()} /> : undefined}
      />

      <ArchitectureTabs active={view} />

      {counts ? <DatabaseView result={counts} /> : <SecurityView />}
    </div>
  )
}