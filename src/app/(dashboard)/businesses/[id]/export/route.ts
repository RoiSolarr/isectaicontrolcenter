import { NextResponse, type NextRequest } from 'next/server'
import { getAdminSession } from '@/features/auth/server/get-admin-session'
import { getBusinessProfile } from '@/features/businesses/server/get-business-profile'
import { getBusinessRecords } from '@/features/businesses/server/get-business-records'
import { parseRecordFilters } from '@/features/businesses/utils/parse-filters'
import { recordsToCsv } from '@/features/businesses/utils/records-csv'
import { toUtcDateKey } from '@/lib/format/dates'

/**
 * GET /businesses/:id/export?q=&when=&status=  ->  CSV of the records matching the current filters.
 * Only iSectAI platform administrators may download; Row Level Security is still enforced by the database.
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const { id } = await params
  const profileResult = await getBusinessProfile(id)
  if (!profileResult.ok) return new NextResponse('Could not load this business.', { status: 500 })
  if (!profileResult.data) return new NextResponse('Business not found.', { status: 404 })

  const business = profileResult.data
  const filters = parseRecordFilters(Object.fromEntries(request.nextUrl.searchParams), business.industry.recordType)
  const records = await getBusinessRecords(
    { id: business.id, timezone: business.timezone, recordType: business.industry.recordType },
    filters,
    { forExport: true },
  )
  if (!records.ok) return new NextResponse('Could not export these records.', { status: 500 })

  const slug = business.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const filename = `${slug}-${business.industry.recordType}s-${toUtcDateKey(new Date())}.csv`

  return new NextResponse(recordsToCsv(records.data, business.timezone), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}