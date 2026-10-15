import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ROUTES } from '@/lib/constants/routes'

/** Shown when the business id does not exist (or the signed-in admin is not allowed to see it). */
export default function BusinessNotFound() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
        <span aria-hidden className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <SearchX className="h-7 w-7" />
        </span>
        <h1 className="font-display text-2xl font-extrabold tracking-tight">Business not found</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          This business doesn’t exist, or the link is out of date. Go back to the directory to pick another one.
        </p>
        <Link href={ROUTES.businesses} className={buttonVariants({ className: 'mt-2' })}>
          Back to businesses
        </Link>
      </CardContent>
    </Card>
  )
}