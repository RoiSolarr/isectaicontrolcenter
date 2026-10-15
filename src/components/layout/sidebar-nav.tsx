'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_SECTIONS } from '@/lib/constants/navigation'
import { cn } from '@/lib/utils'

/** Sidebar links with an active state. Client component only because it needs the current pathname. */
export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Main" className="flex-1 overflow-y-auto px-4 py-4">
      {NAV_SECTIONS.map((section) => (
        <div key={section.title} className="mb-6">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{section.title}</p>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              const base = 'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors'

              if (!item.available) {
                return (
                  <li key={item.href}>
                    <span aria-disabled="true" className={cn(base, 'cursor-not-allowed text-slate-500')}>
                      <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden />
                      {item.label}
                      <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        Soon
                      </span>
                    </span>
                  </li>
                )
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      base,
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal-400',
                      isActive
                        ? 'bg-white/10 text-white before:absolute before:bottom-2 before:left-0 before:top-2 before:w-[3px] before:rounded-full before:bg-brand-teal-400'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    <Icon className={cn('h-[18px] w-[18px] shrink-0', isActive && 'text-brand-teal-300')} aria-hidden />
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}