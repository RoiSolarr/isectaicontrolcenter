import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SEPARATION_LAYERS } from '@/features/architecture/content/data-separation'

/** The four layers that keep one business's data away from another, and which of them exist in the prototype. */
export function SeparationCard() {
  return (
    <Card id="separation" className="scroll-mt-24">
      <CardHeader>
        <div>
          <CardTitle>Data separation & access model</CardTitle>
          <CardDescription>Four layers, so one mistake never exposes another business’s data.</CardDescription>
        </div>
        <Badge variant="success">Defense in depth</Badge>
      </CardHeader>
      <CardContent>
        <ol className="grid gap-4 md:grid-cols-2">
          {SEPARATION_LAYERS.map((layer) => {
            const Icon = layer.icon
            return (
              <li key={layer.step} className="flex flex-col gap-2.5 rounded-lg bg-muted/70 p-4">
                <div className="flex items-center gap-3">
                  <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card text-accent-foreground shadow-sm">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <h3 className="font-display text-sm font-bold tracking-tight">
                    {layer.step} · {layer.title}
                  </h3>
                  <Badge variant={layer.status === 'built' ? 'success' : 'info'} className="ml-auto">
                    {layer.status === 'built' ? 'In prototype' : 'Production design'}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{layer.text}</p>
                <code className="mt-auto w-fit max-w-full truncate rounded bg-card px-2 py-1 font-mono text-[11px] text-muted-foreground">{layer.where}</code>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}