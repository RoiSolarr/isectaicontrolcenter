/** Single source of truth for app routes. */
export const ROUTES = {
  login: '/login',
  overview: '/overview',
  businesses: '/businesses',
  activity: '/activity',
  architecture: '/architecture',
} as const

/** Routes reachable without a Supabase session. Everything else is protected by middleware. */
export const PUBLIC_ROUTES: string[] = [ROUTES.login]

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))
}
