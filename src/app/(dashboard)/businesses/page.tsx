import type { Metadata } from 'next'
import { Pagination } from '@/components/shared/pagination'
import { PageHeader } from '@/components/shared/page-header'
import { SectionError } from '@/components/shared/section-error'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DirectoryFilterBar } from '@/features/businesses/components/directory-filters'
import { DirectoryTable } from '@/features/businesses/components/directory-table'
import { getBusinessDirectory } from '@/features/businesses/server/get-business-directory'
import { parseDirectoryFilters } from '@/features/businesses/utils/parse-filters'
import { buildQueryString } from '@/features/businesses/utils/query-string'
import { ROUTES } from '@/lib/constants/routes'

export const metadata: Metadata = { title: 'Businesses' }

type BusinessesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function BusinessesPage({ searchParams }: BusinessesPageProps) {
  const filters = parseDirectoryFilters(await searchParams)
  const result = await getBusinessDirectory(filters)

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Directory" title="Businesses" description="All organizations connected to the iSectAI platform." />

      {!result.ok ? (
        <SectionError title="We couldn’t load the businesses." message={result.message} />
      ) : (
        <Card>
          <CardHeader>
            <div>
              <CardTitle className="flex items-center gap-2">
                Business directory
                <Badge variant="neutral">{result.data.totalAll} total</Badge>
              </CardTitle>
              <CardDescription>Manage organizations and inspect their records.</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <DirectoryFilterBar filters={filters} industries={result.data.industries} />

            <DirectoryTable
              rows={result.data.rows}
              isFiltered={Boolean(filters.q || filters.industry || filters.status || filters.plan)}
              resetHref={ROUTES.businesses}
            />

            <Pagination
              page={result.data.page}
              pageCount={result.data.pageCount}
              total={result.data.total}
              pageSize={result.data.pageSize}
              noun="businesses"
              hrefFor={(page) => `${ROUTES.businesses}${buildQueryString({ ...filters, page }, { page: 1 })}`}
            />

            <p className="rounded-lg bg-muted/70 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
              Each organization is an isolated tenant. Selecting a business opens its profile and business-specific records.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}