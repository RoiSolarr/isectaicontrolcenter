import type { AccessRow } from '@/features/architecture/types'

/** Rows of the "Internal administrators vs customers" comparison on the Security & decisions tab. */

export const ACCESS_ROWS: AccessRow[] = [
  {
    label: 'Identity record',
    admin: 'core.platform_admins',
    customer: 'core.business_members',
  },
  {
    label: 'Roles',
    admin: 'platform_admin, support',
    customer: 'owner, manager, member',
  },
  {
    label: 'Sees',
    admin: 'Every business on the platform, across industries',
    customer: 'Only the business they belong to',
  },
  {
    label: 'Signs in to',
    admin: 'This internal dashboard',
    customer: 'A separate customer app (not part of this prototype)',
  },
  {
    label: 'Enforced by',
    admin: 'Layout and route checks, then Row Level Security through is_platform_admin()',
    customer: 'Row Level Security that compares each row’s business_id with the user’s membership',
  },
]

export const ACCESS_NOTE =
  'The two kinds of account are kept in different tables on purpose. An administrator is never “a customer with extra rights”, so a mistake in customer permissions cannot hand out admin access.'