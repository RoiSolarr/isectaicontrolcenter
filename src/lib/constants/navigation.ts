import { Building2, Clock, Layers, LayoutDashboard, type LucideIcon } from 'lucide-react'
import { ROUTES } from '@/lib/constants/routes'

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  /** false = page not built yet: shown greyed-out with a "Soon" tag instead of a dead link. */
  available: boolean
}

export type NavSection = {
  title: string
  items: NavItem[]
}

/**
 * Sidebar structure. When you finish a page, flip its `available` flag to true.
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Workspace',
    items: [
      { label: 'Overview', href: ROUTES.overview, icon: LayoutDashboard, available: true },
      { label: 'Businesses', href: ROUTES.businesses, icon: Building2, available: true },
      { label: 'Activity', href: ROUTES.activity, icon: Clock, available: true },
      { label: 'Architecture', href: ROUTES.architecture, icon: Layers, available: true },
    ],
  },
]

const NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((section) => section.items)

/** The nav item that owns a path ("/businesses/abc" belongs to "/businesses"). */
export function findNavItem(pathname: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
}

export function isRouteAvailable(pathname: string): boolean {
  return findNavItem(pathname)?.available ?? false
}