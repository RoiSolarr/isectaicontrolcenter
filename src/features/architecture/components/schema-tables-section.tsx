import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SCHEMA_GROUPS, SCOPE_META } from '@/features/architecture/content/schema-tables'
import type { SchemaGroupDoc, TableCounts, TableDoc } from '@/features/architecture/types'
import { formatNumber } from '@/lib/format/numbers'
import { cn } from '@/lib/utils'

function ColumnList({ table }: { table: TableDoc }) {
  return (
    <ul className="grid gap-x-6 gap-y-1.5 border-t border-border px-3 py-3 sm:grid-cols-2">
      {table.columns.map((column) => (
        <li key={column.name} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <code className="font-mono text-[13px] font-medium">{column.name}</code>
          {column.pk ? <Badge variant="info">PK</Badge> : null}
          {column.tenantKey ? <Badge variant="brand">tenant key</Badge> : null}
          {column.references ? <span className="text-xs text-muted-foreground">→ {column.references}</span> : null}
        </li>
      ))}
    </ul>
  )
}

/** One table (or view). Native <details>, so it opens and closes without JavaScript. */
function TableItem({ table, count }: { table: TableDoc; count: number | null | undefined }) {
  const scope = SCOPE_META[table.scope]

  return (
    <details id={`table-${table.name}`} className="group rounded-lg border border-border bg-card">
      <summary className="flex cursor-pointer list-none flex-col gap-1 rounded-lg px-3 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        <span className="flex flex-wrap items-center gap-2">
          <ChevronRight aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
          <code className="font-mono text-sm font-bold">{table.name}</code>
          {table.kind === 'view' ? <Badge variant="neutral">view</Badge> : null}
          <Badge variant={table.scope === 'tenant' ? 'brand' : 'neutral'} title={scope.hint}>
            {scope.label}
          </Badge>
          {typeof count === 'number' ? <span className="ml-auto text-xs font-semibold tabular-nums text-muted-foreground">{formatNumber(count)} {count === 1 ? 'row' : 'rows'}</span> : null}
        </span>
        <span className="pl-6 text-xs leading-relaxed text-muted-foreground">{table.summary}</span>
      </summary>
      <ColumnList table={table} />
    </details>
  )
}

function SchemaGroupCard({ group, counts, className }: { group: SchemaGroupDoc; counts: TableCounts | null; className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <div>
          <CardTitle className="flex items-center gap-2">
            <span className={cn('rounded-md px-2 py-0.5 font-mono text-sm', group.tone)}>{group.title}</span>
            <span className="text-sm font-medium text-muted-foreground">schema</span>
          </CardTitle>
          <CardDescription>{group.description}</CardDescription>
        </div>
        <Badge variant="neutral">
          {group.tables.length} {group.tables.length === 1 ? 'table' : 'tables'}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {group.tables.map((table) => (
          <TableItem key={table.name} table={table} count={counts?.[table.name]} />
        ))}
      </CardContent>
    </Card>
  )
}

/** Every table, grouped by Postgres schema. This is also the text version of the diagram. */
export function SchemaTablesSection({ counts }: { counts: TableCounts | null }) {
  const [core, ...workflows] = SCHEMA_GROUPS

  return (
    <section aria-labelledby="schema-tables-heading" className="space-y-4">
      <div>
        <h2 id="schema-tables-heading" className="font-display text-xl font-bold tracking-tight">
          Tables by schema
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Open a table to see its columns. Row counts are read live from your database.</p>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <SchemaGroupCard group={core} counts={counts} />
        <div className="space-y-6">
          {workflows.map((group) => (
            <SchemaGroupCard key={group.schema} group={group} counts={counts} />
          ))}
        </div>
      </div>
    </section>
  )
}