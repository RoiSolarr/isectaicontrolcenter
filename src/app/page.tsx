import { redirect } from 'next/navigation'
import { ROUTES } from '@/lib/constants/routes'

// Middleware sends signed-out visitors to /login; everyone else lands on the overview.
export default function HomePage() {
  redirect(ROUTES.overview)
}
