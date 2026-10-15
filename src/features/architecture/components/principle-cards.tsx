import { Boxes, Layers, ShieldCheck, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const PRINCIPLES: { title: string; text: string; icon: LucideIcon }[] = [
  {
    title: 'Shared foundation',
    text: 'Businesses, industries, locations, staff and customers give every sector the same identity and tenancy model.',
    icon: Layers,
  },
  {
    title: 'Industry-specific activity',
    text: 'Clinics create appointments; service teams create jobs. Both attach to the same business, location and customer.',
    icon: Boxes,
  },
  {
    title: 'Tenant-safe by design',
    text: 'business_id is stored on tenant data and checked by database policies, not trusted from interface filters alone.',
    icon: ShieldCheck,
  },
]

/** Three short design principles under the diagram. */
export function PrincipleCards() {
  return (
    <section aria-label="Design principles" className="grid gap-4 md:grid-cols-3">
      {PRINCIPLES.map((principle) => {
        const Icon = principle.icon
        return (
          <Card key={principle.title}>
            <CardContent className="flex items-start gap-3.5">
              <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-bold tracking-tight">{principle.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{principle.text}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}