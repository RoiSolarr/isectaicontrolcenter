import { Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ROADMAP, ROADMAP_DISCLAIMER } from '@/features/architecture/content/tradeoffs-and-roadmap'

/** What would be added to turn the prototype into a production system. */
export function RoadmapCard() {
  return (
    <Card id="roadmap" className="scroll-mt-24">
      <CardHeader>
        <CardTitle>Production roadmap</CardTitle>
        <span className="text-xs text-muted-foreground">Prototype → production hardening</span>
      </CardHeader>
      <CardContent className="space-y-5">
        <ol className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {ROADMAP.map((column, index) => (
            <li key={column.id}>
              <Badge variant="brand">
                {String(index + 1).padStart(2, '0')} · {column.title}
              </Badge>
              <ul className="mt-3 space-y-2">
                {column.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <Alert variant="info">
          <Info aria-hidden />
          <AlertDescription className="mt-0">{ROADMAP_DISCLAIMER}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}