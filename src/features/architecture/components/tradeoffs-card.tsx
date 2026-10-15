import { AlertTriangle, CheckCircle2, type LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ADVANTAGES, LIMITATIONS } from '@/features/architecture/content/tradeoffs-and-roadmap'
import { cn } from '@/lib/utils'

function PointList({ items, icon: Icon, iconClass }: { items: string[]; icon: LucideIcon; iconClass: string }) {
  return (
    <ul className="mt-3 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
          <Icon aria-hidden className={cn('mt-0.5 h-4 w-4 shrink-0', iconClass)} />
          {item}
        </li>
      ))}
    </ul>
  )
}

/** What the approach is good at, and where it is weak. */
export function TradeoffsCard() {
  return (
    <Card id="tradeoffs" className="scroll-mt-24">
      <CardHeader>
        <div>
          <CardTitle>Tradeoffs</CardTitle>
          <CardDescription>An honest look at what this design costs.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div>
          <Badge variant="success">Advantages</Badge>
          <PointList items={ADVANTAGES} icon={CheckCircle2} iconClass="text-emerald-600" />
        </div>
        <div>
          <Badge variant="warning">Limitations</Badge>
          <PointList items={LIMITATIONS} icon={AlertTriangle} iconClass="text-amber-600" />
        </div>
      </CardContent>
    </Card>
  )
}