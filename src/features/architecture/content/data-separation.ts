import { Database, Fingerprint, KeyRound, Lock, Server, ShieldCheck, UserCog, Users } from 'lucide-react'
import { TABLE_COUNT, TENANT_TABLE_COUNT } from '@/features/architecture/content/schema-tables'
import type { RequestStep, SeparationLayer } from '@/features/architecture/types'

/**
 * Text for "Data separation & access model" and "How every admin request is checked".
 * `where` points at real files and database objects, so a reviewer can jump from the explanation to the code.
 */

export const SEPARATION_LAYERS: SeparationLayer[] = [
  {
    step: 1,
    title: 'Tenant key',
    text: 'Every tenant-owned row carries business_id, so each record belongs to exactly one business. Records point at their own business’s locations, customers and staff.',
    where: `business_id on ${TENANT_TABLE_COUNT} of ${TABLE_COUNT} tables`,
    status: 'built',
    icon: KeyRound,
  },
  {
    step: 2,
    title: 'Row Level Security',
    text: 'Postgres itself decides which rows a signed-in user may read. The interface never relies on its own filters for security. Today’s policies check is_platform_admin().',
    where: 'RLS policies + public.is_platform_admin()',
    status: 'built',
    icon: Lock,
  },
  {
    step: 3,
    title: 'Internal admins',
    text: 'iSectAI staff live in their own table with a role (platform_admin or support). Signing in is not enough: the dashboard layout and the CSV export routes all re-check that row.',
    where: 'core.platform_admins',
    status: 'built',
    icon: UserCog,
  },
  {
    step: 4,
    title: 'Customer access',
    text: 'A customer signs in as a member of one business (owner, manager or member) and would only see rows whose business_id matches that membership. Customers are already refused by this dashboard.',
    where: 'core.business_members + customer RLS policies',
    status: 'designed',
    icon: Users,
  },
]

export const REQUEST_STEPS: RequestStep[] = [
  {
    title: 'Browser',
    text: 'Sends the request with the Supabase session cookie.',
    where: 'Supabase Auth session',
    icon: Fingerprint,
  },
  {
    title: 'Middleware',
    text: 'Refreshes the session and sends signed-out visitors to /login.',
    where: 'src/middleware.ts',
    icon: ShieldCheck,
  },
  {
    title: 'Admin check',
    text: 'The dashboard layout requires a row in platform_admins. Customer accounts are turned away here.',
    where: 'features/auth/server/get-admin-session.ts',
    icon: UserCog,
  },
  {
    title: 'Query as the user',
    text: 'Pages query with the signed-in user’s own session and the public anon key. No service-role key exists in the app.',
    where: 'lib/supabase/server.ts',
    icon: Server,
  },
  {
    title: 'Row Level Security',
    text: 'Postgres applies its policies to every query and returns only the rows this user may see.',
    where: 'RLS policies in supabase/migrations',
    icon: Database,
  },
]