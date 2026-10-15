import { Fingerprint, LineChart, ScrollText, ShieldCheck } from 'lucide-react'
import type { RoadmapColumn } from '@/features/architecture/types'

/** Text for the "Advantages & limitations" and "Production roadmap" cards on the Security & decisions tab. */

export const ADVANTAGES: string[] = [
  'Fast to iterate: one schema and one set of migrations serve every industry.',
  'Foreign keys and SQL constraints keep records consistent.',
  'Security rules sit next to the data, so a bug in the interface cannot bypass them.',
  'Plain Postgres means low lock-in and easy export.',
  'Reporting across businesses, like the Overview and Activity pages, is an ordinary query.',
]

export const LIMITATIONS: string[] = [
  'Tenants share tables, so a mistake in a policy could expose another business. Policies need automated tests.',
  'One very large business can slow the shared tables for everyone (noisy neighbour).',
  'Very different industries may eventually outgrow the shared core and need their own tables or services.',
  'A client that demands a fully separate database would need a different tenancy model, such as schema-per-tenant.',
  'Medical data needs compliance controls well beyond a prototype.',
]

export const ROADMAP: RoadmapColumn[] = [
  {
    id: 'identity',
    title: 'Identity',
    icon: Fingerprint,
    items: ['SSO and multi-factor sign-in for staff', 'Invite flow for new admins and customers', 'Role-scoped admin access (support vs platform_admin)', 'A customer portal built on business_members'],
  },
  {
    id: 'security',
    title: 'Security',
    icon: ShieldCheck,
    items: [
      'Automated tests proving one business cannot read another’s rows',
      'Composite (id, business_id) foreign keys, so a record can never point at another business’s customer',
      'Audit log for every elevated admin action',
      'Secret management and key rotation',
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance',
    icon: ScrollText,
    items: ['Data retention and deletion policies', 'Encrypted backups with point-in-time recovery', 'Privacy and access reviews', 'Legal review for medical data (for example HIPAA)'],
  },
  {
    id: 'operations',
    title: 'Operations',
    icon: LineChart,
    items: ['Monitoring and alerting', 'Disaster-recovery drills', 'Load testing and indexes; partition activity_events by month', 'Staging environment with CI that runs the migrations'],
  },
]

export const ROADMAP_DISCLAIMER =
  'This is a prototype architecture, not a compliance certification. Medical data requires additional legal, operational and security review before production.'