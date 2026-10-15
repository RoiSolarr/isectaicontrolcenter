import { Info } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ErDiagramCard } from '@/features/architecture/components/er-diagram-card'
import { PrincipleCards } from '@/features/architecture/components/principle-cards'
import { ReproduceCard } from '@/features/architecture/components/reproduce-card'
import { SchemaStatCards } from '@/features/architecture/components/schema-stat-cards'
import { SchemaTablesSection } from '@/features/architecture/components/schema-tables-section'
import type { TableCountsSnapshot } from '@/features/architecture/types'
import type { ServerResult } from '@/features/businesses/types'

/** The "Database architecture" tab. The diagram and table documentation work even if the live row counts fail. */
export function DatabaseView({ result }: { result: ServerResult<TableCountsSnapshot> }) {
  const counts = result.ok ? result.data.counts : null

  return (
    <div className="space-y-6">
      {!result.ok ? (
        <Alert variant="warning">
          <Info aria-hidden />
          <AlertTitle>Live row counts are unavailable.</AlertTitle>
          <AlertDescription>
            {result.message.replace(/\.$/, '')}. The diagram and table documentation below do not depend on the database. Check the Supabase connection, then use Refresh to try again.
          </AlertDescription>
        </Alert>
      ) : null}

      <SchemaStatCards counts={counts} />
      <ErDiagramCard />
      <PrincipleCards />
      <SchemaTablesSection counts={counts} />
      <ReproduceCard />
    </div>
  )
}