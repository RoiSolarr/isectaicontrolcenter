import type { AdminSession } from '@/features/auth/server/get-admin-session'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { ConnectionBadge } from '@/components/layout/connection-badge'
import { GlobalSearch } from '@/components/layout/global-search'
import { MobileSidebar } from '@/components/layout/mobile-sidebar'
import { SidebarContent } from '@/components/layout/sidebar'
import { UserMenu } from '@/components/layout/user-menu'

export function Topbar({ session }: { session: AdminSession }) {
  return (
    <header className="sticky top-0 z-20 flex h-[72px] items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur sm:px-6 lg:px-10">
      <MobileSidebar>
        <SidebarContent />
      </MobileSidebar>

      <div className="min-w-0 flex-1">
        <Breadcrumbs />
      </div>

      <div className="hidden w-64 md:block xl:w-80">
        <GlobalSearch />
      </div>
      <ConnectionBadge />
      <div className="hidden h-8 w-px bg-border sm:block" aria-hidden />
      <UserMenu session={session} />
    </header>
  )
}