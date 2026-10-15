import { ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { REQUEST_STEPS } from '@/features/architecture/content/data-separation'

/** What happens to a request before any data is returned, with the file that does each step. */
export function RequestPathCard() {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>How every admin request is checked</CardTitle>
          <CardDescription>This is the path through the real code, from browser to database.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-5 xl:gap-6">
          {REQUEST_STEPS.map((step, index) => {
            const Icon = step.icon
            const isLast = index === REQUEST_STEPS.length - 1
            return (
              <li key={step.title} className="relative flex flex-col gap-2 rounded-lg border border-border p-4">
                <div className="flex items-center gap-2.5">
                  <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h3 className="text-sm font-bold">
                    <span className="mr-1 text-muted-foreground">{index + 1}</span>
                    {step.title}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{step.text}</p>
                <code className="mt-auto break-words font-mono text-[11px] text-muted-foreground">{step.where}</code>
                {!isLast ? <ArrowRight aria-hidden className="absolute -right-5 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-muted-foreground xl:block" /> : null}
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}