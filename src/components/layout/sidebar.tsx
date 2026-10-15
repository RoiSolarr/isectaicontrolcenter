import { BrandLogo } from '@/components/shared/brand-logo'
import { EnvironmentBadge } from '@/components/layout/environment-badge'
import { SidebarNav } from '@/components/layout/sidebar-nav'

/** Everything inside the dark sidebar. Reused by the desktop sidebar and the mobile drawer. */
export function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pb-3 pt-7">
        <BrandLogo tone="light" />
      </div>
      <SidebarNav />
      <div className="space-y-3 border-t border-white/10 p-5">
        <p className="text-xs leading-relaxed text-slate-400">
          Internal administrator workspace
          <br />
          Private to iSectAI staff
        </p>
        <EnvironmentBadge />
      </div>
    </div>
  )
}