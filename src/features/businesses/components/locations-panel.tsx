import { MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { BusinessLocation } from '@/features/businesses/types'

export function LocationsPanel({ locations }: { locations: BusinessLocation[] }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-lg font-bold tracking-tight">
          Locations<span className="ml-2 text-sm font-medium text-muted-foreground">· {locations.length}</span>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">Offices, clinics and dispatch yards of this business.</p>
      </div>

      {locations.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No locations have been added yet.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {locations.map((location) => (
            <li key={location.id} className="flex gap-3 rounded-xl border border-border p-4">
              <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <MapPin className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-2 font-semibold">
                  {location.name}
                  {location.isPrimary ? <Badge variant="brand">Primary</Badge> : null}
                </p>
                <address className="mt-1 text-sm not-italic text-muted-foreground">
                  {location.addressLine}
                  <br />
                  {location.city}, {location.state} {location.postalCode}
                </address>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}