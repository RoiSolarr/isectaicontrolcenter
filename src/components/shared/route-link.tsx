import Link from 'next/link'
import * as React from 'react'
import { isRouteAvailable } from '@/lib/constants/navigation'
import { cn } from '@/lib/utils'

type RouteLinkProps = Omit<React.ComponentProps<typeof Link>, 'href'> & { href: string }

/**
 * A normal <Link> when the target page exists, otherwise a greyed-out label.
 * Prevents dead links while pages are still being built (see `available` in lib/constants/navigation.ts).
 */
export function RouteLink({ href, className, children, ...props }: RouteLinkProps) {
  if (!isRouteAvailable(href)) {
    return (
      <span aria-disabled="true" title="Coming soon" className={cn(className, 'cursor-not-allowed opacity-50')}>
        {children}
      </span>
    )
  }

  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  )
}