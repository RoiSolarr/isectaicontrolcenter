# iSectAI Control Center

Internal administrator console for the iSectAI platform: monitor every connected business
(medical clinics and field-service companies) from one place, with each business's data kept isolated.

Built for the **iSectAI Developer Paid Trial — Database Architecture & Admin Dashboard**.
All business and customer data in this repository is fictional.

**Live demo:** https://isectaicontrolcenter.vercel.app
(sign in with the administrator account listed under [Demo accounts](#demo-accounts-seed-only))

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) + React 19 |
| Language | TypeScript (end to end) |
| Styling / UI | Tailwind CSS 3 + shadcn/ui-style components |
| Database / Auth | Supabase (Postgres, Row Level Security, Supabase Auth) |
| Tooling | Supabase CLI migrations + `seed.sql`, ESLint, `tsc` |

## What the trial brief asked for, and where to find it

| Brief requirement | Where |
| --- | --- |
| At least 3 fictional businesses (2 clinics + 1 service business) | Clearview Family Clinic, Lakefront Orthopedics, Northstar Plumbing & Heating (`supabase/seed.sql`) |
| A list of businesses | **Businesses** page (search, industry / status / plan filters) and **Overview** |
| Basic information about each business | Business profile header: contact, location, plan, status, health, storage |
| Business-specific records | Business → first tab: **Appointments** (clinics) or **Service jobs** (Northstar), with filters and CSV export |
| Working connection to the database | Every page reads live from Supabase; **Architecture** shows live row counts |
| Database structure + sample data | `supabase/migrations/` and `supabase/seed.sql` |
| Setup instructions | This README |
| Architecture explanation | **Architecture** page in the app, and `docs/ARCHITECTURE.md` |

## Build status

| Page | Status |
| --- | --- |
| Login | ✅ Done |
| Overview | ✅ Done |
| Businesses (directory, profile, records, CSV export) | ✅ Done |
| Activity (feed, filters, chart, CSV export) | ✅ Done |
| Architecture | ✅ Done |
| Settings, Help & support | ⏳ Planned, not part of the prototype |

## Database at a glance

Three Postgres schemas keep the data organised:

| Schema | Holds |
| --- | --- |
| `core` | Shared by every business: `industries`, `businesses`, `locations`, `staff`, `customers`, `activity_events`, `platform_admins`, `business_members`, and the `business_stats` view |
| `medical` | Clinic records: `appointments` |
| `field_service` | Plumbing / HVAC / electrical records: `jobs` |

Every tenant-owned row carries `business_id`. Row Level Security keeps businesses apart.
Details and reasoning: `docs/ARCHITECTURE.md` or the **Architecture** page.

---

## Quick start (local database — recommended)

Requirements: **Node 20+** and **Docker** (the Supabase CLI runs Postgres in Docker).

```bash
# 1. Install dependencies
npm install

# 2. Start local Supabase (first run downloads Docker images)
npm run db:start
#    -> prints "API URL" and "anon key". Copy them into .env.local (step 3).

# 3. Configure environment
cp .env.example .env.local
#    NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
#    NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from step 2>

# 4. Create the tables, RLS policies and load the sample data (one command)
npm run db:reset

# 5. Run the app
npm run dev          # http://localhost:3000
```

`supabase/config.toml` already exposes the `core`, `medical` and `field_service` schemas to the API.
If you change that file, run `npm run db:stop` and `npm run db:start` again.

### Demo accounts (seed only)

| Account | Password | What it proves |
| --- | --- | --- |
| `alex.morgan@isectai.com` | `ChangeMe!2026` | iSectAI platform administrator — can sign in |
| `office@lakefront.example` | `ChangeMe!2026` | Customer user — valid Supabase account, **rejected** by the admin console |

These passwords exist only to make the demo reproducible. Remove or change them before using any real project.

## Using a hosted Supabase project instead

1. Create a project at supabase.com and copy **Project URL** and the **anon / publishable key**
   (Project Settings → API) into `.env.local`.
2. **Expose the three schemas the app reads.** In the project's API settings, add `core`, `medical`
   and `field_service` to **Exposed schemas** and save. Without this, every page shows an
   "invalid schema" error.
3. Create the tables, either:
   - with the CLI: `npx supabase login`, `npx supabase link --project-ref <your-project-ref>`, `npm run db:push`; or
   - in the SQL editor: run the four files in `supabase/migrations/` one by one, in filename order.
4. Load the sample data: open the SQL editor, paste `supabase/seed.sql`, and run it.
   *(If the demo-account inserts into `auth.users` fail in your project, delete section 1 of the seed
   (down to "-- 2. Industries"), run the rest, create your admin user in
   **Authentication → Users**, and then run:)*
```sql
   insert into core.platform_admins (user_id, full_name)
   select id, 'Your Name' from auth.users where email = 'you@yourcompany.com';
```
5. In **Authentication → Providers → Email**, turn off "Allow new users to sign up" so only
   provisioned staff can have accounts.
6. **If you deploy the app** (for example on Vercel), add the same environment variables in the host's
   settings, then go to **Authentication → URL Configuration** in Supabase. Set **Site URL** to the
   deployed address (no wildcard) and add `https://your-deployed-url/**` to **Redirect URLs**.
   Without this, sign-in can redirect to `localhost` or be blocked.

### Check that the data loaded

```sql
select 'businesses' as table_name, count(*) from core.businesses
union all select 'locations',       count(*) from core.locations
union all select 'staff',           count(*) from core.staff
union all select 'customers',       count(*) from core.customers
union all select 'appointments',    count(*) from medical.appointments
union all select 'jobs',            count(*) from field_service.jobs
union all select 'activity_events', count(*) from core.activity_events
union all select 'platform_admins', count(*) from core.platform_admins;
```

Expected: 3 · 5 · 37 · 3037 · 6162 · 2480 · 10 · 1.

### Start over (demo project only)

This deletes everything in the three schemas and the two demo logins. Never run it on a real project.

```sql
drop schema if exists core, medical, field_service cascade;
delete from auth.users where email in ('alex.morgan@isectai.com', 'office@lakefront.example');
```

Then run the migrations and the seed again.

## Environment variables

Copy `.env.example` to `.env.local` (git-ignored). Real values are never committed.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon / publishable key (safe in the browser **because** RLS protects the data) |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Optional: target of the login page's "Forgot password?" link |

While the placeholder values are still in place, the login page shows a "Supabase is not connected yet" notice instead of crashing.

On a host such as Vercel, `NEXT_PUBLIC_` values are baked in at build time, so redeploy after changing them.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run db:start` / `db:stop` | Start / stop local Supabase |
| `npm run db:reset` | Re-apply migrations and `seed.sql` from scratch |
| `npm run db:push` | Push migrations to a linked hosted project |
| `npm run db:types` | Regenerate `src/types/database.ts` from the local database |

---

## Project structure

Code is grouped **by feature**, with descriptive file names, so a bug can be traced quickly.

```
src/
├─ app/                          # Routing only — thin pages that compose feature components
│  ├─ (auth)/login/page.tsx      # Public login page
│  ├─ (dashboard)/               # Protected area (admin guard in layout.tsx)
│  │  ├─ layout.tsx
│  │  ├─ overview/               # Platform KPIs, activity chart, business health
│  │  ├─ businesses/             # Directory · [id]/ profile + records · [id]/export (CSV)
│  │  ├─ activity/               # Platform feed · export (CSV)
│  │  └─ architecture/           # Database architecture + security decisions
│  └─ layout.tsx · page.tsx · globals.css
├─ features/                     # One folder per feature: components/ · server/ · utils/ · types.ts · constants.ts
│  ├─ auth/                      # Sign-in/out, admin check (server/get-admin-session.ts)
│  ├─ overview/
│  ├─ businesses/                # server/get-business-directory · get-business-profile · get-business-records · get-business-people
│  ├─ activity/
│  └─ architecture/              # content/ holds the text shown on the Architecture page
├─ components/
│  ├─ layout/                    # Sidebar, top bar, breadcrumbs, user menu
│  ├─ shared/                    # Reusable pieces (pagination, page header, ...)
│  └─ ui/                        # shadcn-style primitives
├─ lib/
│  ├─ supabase/                  # client.ts (browser) · server.ts · middleware.ts · env.ts
│  ├─ constants/                 # routes.ts · navigation.ts
│  ├─ format/ · hooks/ · utils.ts
├─ types/database.ts             # Database types, one entry per schema (regenerate with npm run db:types)
└─ middleware.ts                 # Refreshes the session; sends signed-out visitors to /login

supabase/
├─ config.toml                   # Local CLI config (schemas exposed, self-sign-up disabled)
├─ migrations/                   # 1 schemas + tables · 2 permissions + RLS · 3 dashboard views · 4 admin self-profile
└─ seed.sql                      # Fictional businesses, staff, customers, appointments, jobs, activity

docs/ARCHITECTURE.md             # Design decisions (the trial's "Architecture" write-up)
```

## How login works

1. `middleware.ts` refreshes the Supabase session cookie and redirects signed-out visitors to `/login`.
2. `signInAction` validates the form (Zod), calls `supabase.auth.signInWithPassword`, then checks that the user
   has a row in **`core.platform_admins`**. Customer users do not, so they are signed out again with a clear message.
3. `(dashboard)/layout.tsx` repeats the admin check on every dashboard request (defence in depth).
4. `?next=` redirects are limited to same-site paths (no open redirects).

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Yellow "Supabase is not connected yet" notice | Put real values in `.env.local`, restart `npm run dev` |
| Pages show a red error about schemas | Hosted: add `core`, `medical`, `field_service` to Exposed schemas. Local: restart with `npm run db:stop` then `npm run db:start` |
| "permission denied for schema core" | Migration 2 (`..._row_level_security.sql`) was not applied |
| Pages load but lists are empty | The seed was not run: `npm run db:reset`, or paste `supabase/seed.sql` into the SQL editor |
| "Email or password is incorrect" with demo account | The seed did not run, or its section 1 failed |
| "duplicate key" on `auth.users` while seeding | The demo users already exist: run the "Start over" SQL first |
| "Database error querying schema" on sign-in | Seeded auth rows are not compatible with your Supabase version: create the user in the dashboard and add the `core.platform_admins` row (see hosted step 4) |
| `db push` says "up to date" but tables are missing | The migration versions were recorded by an older run: run the four files in the SQL editor instead |
| Sign-in on a deployed site redirects to `localhost` or is blocked | Set Site URL and Redirect URLs in Supabase **Authentication → URL Configuration** to the deployed address (see hosted step 6) |
| Deployed site shows no data or "Invalid API key" | An environment variable is missing or wrong: fix it in the host's settings and redeploy |
| "We could not reach the authentication service" | Is `npm run db:start` running? Is the URL in `.env.local` right? |
| Port 54321/54322 already in use | `npm run db:stop`, or change ports in `supabase/config.toml` |