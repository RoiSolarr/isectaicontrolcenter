import Link from 'next/link'
import { DEFAULT_VIEW, VIEW_TABS } from '@/features/architecture/constants'
import type { ArchitectureView } from '@/features/architecture/types'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils'

/** Tab bar for the Architecture page. Each tab is a real link (?view=security), so it works without JavaScript and can be shared. */
export function ArchitectureTabs({ active }: { active: ArchitectureView }) {
  return (
    <nav aria-label="Architecture sections" className="border-b border-border">
      <ul className="-mb-px flex gap-1 overflow-x-auto">
        {VIEW_TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.id === active
          return (
            <li key={tab.id} className="shrink-0">
              <Link
                href={tab.id === DEFAULT_VIEW ? ROUTES.architecture : `${ROUTES.architecture}?view=${tab.id}`}
                scroll={false}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-2 border-b-2 px-3 py-3.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {tab.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}