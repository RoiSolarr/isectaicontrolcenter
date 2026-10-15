import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ACCESS_NOTE, ACCESS_ROWS } from '@/features/architecture/content/access-model'

/** Internal administrators and customers, side by side. */
export function AccessModelCard() {
  return (
    <Card id="access" className="scroll-mt-24">
      <CardHeader>
        <div>
          <CardTitle>Internal administrators vs customers</CardTitle>
          <CardDescription>Two kinds of sign-in, kept apart in the database.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted/70">
              <tr>
                <th scope="col" className="w-40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span className="sr-only">Topic</span>
                </th>
                <th scope="col" className="px-4 py-3">
                  <Badge variant="brand">Internal administrator</Badge>
                </th>
                <th scope="col" className="px-4 py-3">
                  <Badge variant="warning">Customer (business user)</Badge>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ACCESS_ROWS.map((row) => (
                <tr key={row.label} className="align-top">
                  <th scope="row" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {row.label}
                  </th>
                  <td className="px-4 py-3 leading-relaxed">{row.admin}</td>
                  <td className="px-4 py-3 leading-relaxed">{row.customer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="rounded-lg bg-muted/70 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">{ACCESS_NOTE}</p>
      </CardContent>
    </Card>
  )
}