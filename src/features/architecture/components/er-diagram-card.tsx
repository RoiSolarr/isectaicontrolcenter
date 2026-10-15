import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ER_GROUP_STYLE } from '@/features/architecture/content/er-diagram'
import { ErDiagram } from '@/features/architecture/components/er-diagram'
import { cn } from '@/lib/utils'

/** The diagram plus its legend. */
export function ErDiagramCard() {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Shared multi-tenant relational model</CardTitle>
          <CardDescription>
            Common organisation tables plus industry-specific workflow tables. Every tenant-owned row carries <code className="font-mono text-xs">business_id</code>.
          </CardDescription>
        </div>
        <Badge variant="brand">PostgreSQL · Supabase</Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        <ErDiagram />

        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground" aria-label="Legend">
          {Object.values(ER_GROUP_STYLE).map((style) => (
            <li key={style.label} className="flex items-center gap-2">
              <span aria-hidden className={cn('h-3 w-5 rounded border', style.legend)} />
              {style.label}
            </li>
          ))}
          <li>Arrows run from the “one” side to the “many” side</li>
          <li>Hover or tab to a table to trace its links</li>
        </ul>

        <p className="rounded-lg bg-muted/70 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
          Appointments and jobs also carry <code className="font-mono">business_id</code>, like every tenant-owned table. Those links are left out of the picture so it stays readable, and Row Level
          Security checks them in the database.
        </p>
      </CardContent>
    </Card>
  )
}