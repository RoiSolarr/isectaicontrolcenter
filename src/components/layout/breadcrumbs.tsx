'use client'

import { usePathname } from 'next/navigation'
import { findNavItem } from '@/lib/constants/navigation'

/** "iSectAI / Overview". The second part is the sidebar label of the current section. */
export function Breadcrumbs() {
  const pathname = usePathname()
  const current = findNavItem(pathname)

  return (
    <nav aria-label="Breadcrumb" className="min-w-0 text-sm">
      <ol className="flex items-center gap-2 whitespace-nowrap">
        <li className="text-muted-foreground">iSectAI</li>
        {current ? (
          <>
            <li aria-hidden className="text-muted-foreground/60">
              /
            </li>
            <li aria-current="page" className="truncate font-semibold text-foreground">
              {current.label}
            </li>
          </>
        ) : null}
      </ol>
    </nav>
  )
}