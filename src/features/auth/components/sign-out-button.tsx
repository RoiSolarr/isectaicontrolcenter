import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOutAction } from '@/features/auth/actions'

/** Works in Server and Client Components (plain <form> + Server Action). */
export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action={signOutAction}>
      <Button type="submit" variant="outline" className={className}>
        <LogOut className="h-4 w-4" aria-hidden />
        Sign out
      </Button>
    </form>
  )
}
