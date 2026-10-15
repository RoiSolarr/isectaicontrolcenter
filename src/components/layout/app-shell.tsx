import * as React from 'react'
import type { AdminSession } from '@/features/auth/server/get-admin-session'
import { NavigationLock } from '@/components/layout/navigation-lock'
import { SidebarContent } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'

/** Sidebar + top bar + page area. Wraps every page inside the (dashboard) route group. */
export function AppShell({ session, children }: { session: AdminSession; children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <NavigationLock />
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-brand-navy-900 lg:block">
        <SidebarContent />
      </aside>

      <div className="lg:pl-64">
        <Topbar session={session} />
        <main id="main-content" className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}