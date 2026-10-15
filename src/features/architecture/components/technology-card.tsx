import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TECHNOLOGY_BADGE, TECHNOLOGY_REASONS, TECHNOLOGY_STACK, TECHNOLOGY_SUMMARY, TECHNOLOGY_WHY_NOT_OTHERS } from '@/features/architecture/content/technology-choice'

/** Why this database and these tools. */
export function TechnologyCard() {
  return (
    <Card id="technology" className="scroll-mt-24">
      <CardHeader>
        <CardTitle>Technology choice</CardTitle>
        <Badge variant="brand">{TECHNOLOGY_BADGE}</Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-relaxed text-muted-foreground">{TECHNOLOGY_SUMMARY}</p>

        <ul className="flex flex-wrap gap-2" aria-label="Reasons">
          {TECHNOLOGY_REASONS.map((reason) => (
            <li key={reason}>
              <Badge variant="neutral">{reason}</Badge>
            </li>
          ))}
        </ul>

        <dl className="divide-y divide-border rounded-lg border border-border text-sm">
          {TECHNOLOGY_STACK.map((row) => (
            <div key={row.layer} className="flex flex-col gap-0.5 px-3 py-2.5 sm:flex-row sm:gap-4">
              <dt className="shrink-0 font-semibold sm:w-36">{row.layer}</dt>
              <dd className="text-muted-foreground">{row.choice}</dd>
            </div>
          ))}
        </dl>

        <p className="rounded-lg bg-muted/70 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Why Supabase and not something else? </span>
          {TECHNOLOGY_WHY_NOT_OTHERS}
        </p>
      </CardContent>
    </Card>
  )
}