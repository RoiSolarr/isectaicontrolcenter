import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { BusinessProfile } from '@/features/businesses/types'
import { timeZoneAbbreviation } from '@/features/businesses/utils/time-zone'
import { formatDateOnly } from '@/lib/format/dates'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold">{children}</dd>
    </div>
  )
}

const LINK = 'text-primary hover:underline'

export function BusinessProfileCard({ business }: { business: BusinessProfile }) {
  const location = business.primaryLocation

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business profile</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2 2xl:grid-cols-3">
          <Field label="Legal name">{business.legalName}</Field>
          <Field label="Primary contact">{business.primaryContact}</Field>
          <Field label="Joined platform">{formatDateOnly(business.joinedAt)}</Field>
          <Field label="Email">
            <a href={`mailto:${business.email}`} className={LINK}>
              {business.email}
            </a>
          </Field>
          <Field label="Phone">
            <a href={`tel:${business.phone.replace(/[^\d+]/g, '')}`} className={LINK}>
              {business.phone}
            </a>
          </Field>
          <Field label="Primary location">
            {location ? `${location.addressLine}, ${location.city}, ${location.state} ${location.postalCode}` : `${business.city}, ${business.state}`}
          </Field>
          <Field label="Time zone">
            {business.timezone} ({timeZoneAbbreviation(business.timezone)})
          </Field>
        </dl>
      </CardContent>
    </Card>
  )
}