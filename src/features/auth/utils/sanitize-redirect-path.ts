import { ROUTES } from '@/lib/constants/routes'

/**
 * Only allow same-site relative paths after sign-in (prevents open redirects
 * such as /login?next=https://evil.example or //evil.example).
 */
export function sanitizeRedirectPath(value: string | null | undefined): string {
  if (!value) return ROUTES.overview
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return ROUTES.overview
  if (value === ROUTES.login || value.startsWith(`${ROUTES.login}?`) || value.startsWith(`${ROUTES.login}/`)) {
    return ROUTES.overview
  }
  return value
}
