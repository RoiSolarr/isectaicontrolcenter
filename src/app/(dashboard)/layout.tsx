import { redirect } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { getAdminSession } from '@/features/auth/server/get-admin-session'
import { ROUTES } from '@/lib/constants/routes'

/**
 * Guards every dashboard page. Middleware already requires a session;
 * this layer additionally requires the user to be an iSectAI platform administrator,
 * then wraps the page in the sidebar + top bar shell.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession()
  if (!session) redirect(`${ROUTES.login}?reason=unauthorized`)

  return <AppShell session={session}>{children}</AppShell>
}