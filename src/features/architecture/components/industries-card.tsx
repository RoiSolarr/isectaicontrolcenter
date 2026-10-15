import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ADD_INDUSTRY_STEPS, INDUSTRY_BADGE, INDUSTRY_HOW_IT_SHOWS_UP, INDUSTRY_SUMMARY, INDUSTRY_WORKFLOWS } from '@/features/architecture/content/industry-model'
import { cn } from '@/lib/utils'

/** How one schema supports several industries, and how a new industry would be added. */
export function IndustriesCard() {
  return (
    <Card id="industries" className="scroll-mt-24">
      <CardHeader>
        <CardTitle>Multi-business, multi-industry</CardTitle>
        <Badge variant="info">{INDUSTRY_BADGE}</Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-relaxed text-muted-foreground">{INDUSTRY_SUMMARY}</p>

        <ul className="grid gap-3 sm:grid-cols-2">
          {INDUSTRY_WORKFLOWS.map((workflow) => {
            const Icon = workflow.icon
            return (
              <li key={workflow.label} className="flex items-start gap-3 rounded-lg bg-muted/70 p-3">
                <span aria-hidden className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', workflow.tone)}>
                  <Icon className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{workflow.label}</p>
                  <p className="text-sm font-semibold">{workflow.detail}</p>
                  <code className="mt-0.5 block truncate font-mono text-xs text-muted-foreground">{workflow.table}</code>
                </div>
              </li>
            )
          })}
        </ul>

        <p className="text-sm leading-relaxed text-muted-foreground">{INDUSTRY_HOW_IT_SHOWS_UP}</p>

        <div>
          <h3 className="text-sm font-semibold">Adding a new industry</h3>
          <ol className="mt-2 space-y-2">
            {ADD_INDUSTRY_STEPS.map((step, index) => (
              <li key={step} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span aria-hidden className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}