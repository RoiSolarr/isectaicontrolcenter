import { LogOut } from 'lucide-react'
import { signOutAction } from '@/features/auth/actions'
import type { AdminSession } from '@/features/auth/server/get-admin-session'

const ROLE_LABELS: Record<AdminSession['admin']['role'], string> = {
  platform_admin: 'Platform administrator',
  support: 'Support',
}

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return `${first}${last}`.toUpperCase()
}

/** Avatar, name, role, and a sign-out button (plain form + Server Action, no client JS). */
export function UserMenu({ session }: { session: AdminSession }) {
  const { full_name: fullName, role } = session.admin

  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground"
      >
        {getInitials(fullName)}
      </span>
      <div className="hidden min-w-0 leading-tight md:block">
        <p className="truncate text-sm font-semibold">{fullName}</p>
        <p className="truncate text-xs text-muted-foreground">{ROLE_LABELS[role]}</p>
      </div>
      <form action={signOutAction}>
        <button
          type="submit"
          title="Sign out"
          aria-label="Sign out"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <LogOut className="h-4 w-4" aria-hidden />
        </button>
      </form>
    </div>
  )
}