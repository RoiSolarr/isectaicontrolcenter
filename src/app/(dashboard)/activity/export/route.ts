import { NextResponse, type NextRequest } from 'next/server'
import { getAdminSession } from '@/features/auth/server/get-admin-session'
import { getActivityExport } from '@/features/activity/server/get-activity-export'
import { activityToCsv } from '@/features/activity/utils/activity-csv'
import { parseActivityFilters } from '@/features/activity/utils/parse-filters'
import { toUtcDateKey } from '@/lib/format/dates'

/**
 * GET /activity/export?q=&type=&business=&range=  ->  CSV of the events matching the current filters (newest 1,000 at most).
 * Only iSectAI platform administrators may download; Row Level Security is still enforced by the database.
 */
export async function GET(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const filters = parseActivityFilters(Object.fromEntries(request.nextUrl.searchParams))
  const result = await getActivityExport(filters)
  if (!result.ok) return new NextResponse('Could not export the activity log.', { status: 500 })

  return new NextResponse(activityToCsv(result.data), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="isectai-activity-${toUtcDateKey(new Date())}.csv"`,
      'Cache-Control': 'no-store',
    },
  })
}