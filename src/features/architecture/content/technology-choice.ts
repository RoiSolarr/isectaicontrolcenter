/** Text for the "Technology choice" card on the Security & decisions tab. */

export const TECHNOLOGY_BADGE = 'Supabase + PostgreSQL'

export const TECHNOLOGY_SUMMARY =
  'PostgreSQL is the source of truth. Supabase adds managed hosting, authentication, migrations and Row Level Security on top of plain Postgres, so every rule lives in SQL that the team can read, review and move elsewhere.'

export const TECHNOLOGY_REASONS = ['Relational integrity', 'Managed auth', 'Row Level Security', 'SQL migrations', 'Low lock-in']

export const TECHNOLOGY_STACK: { layer: string; choice: string }[] = [
  { layer: 'Database & auth', choice: 'Supabase: PostgreSQL, Auth, Row Level Security' },
  { layer: 'Application', choice: 'Next.js (React) with TypeScript, using generated database types' },
  { layer: 'Interface', choice: 'Tailwind CSS with shadcn/ui-style components' },
  { layer: 'Reproducible setup', choice: 'Supabase CLI migrations, a seed.sql file, README and .env.example' },
]

export const TECHNOLOGY_WHY_NOT_OTHERS =
  'The brief allows another platform if it is justified. Supabase is already used at iSectAI and is plain Postgres underneath, so moving away later is a database move, not a rewrite. It also ships auth and Row Level Security, which answer the tenant-separation and admin-versus-customer questions directly, and that left more time for the prototype itself.'