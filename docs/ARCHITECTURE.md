# Architecture notes

Answers to section C of the trial brief. The *Architecture* page of the dashboard presents the same material.

Live demo: https://isectaicontrolcenter.vercel.app

## 1. Technology: Supabase (Postgres) + Next.js + TypeScript

- **Supabase** — iSectAI already uses it, so this is the lowest-risk, fastest-to-adopt choice. It bundles
  Postgres, Auth and Row Level Security (RLS), which map directly onto the brief's two hard questions:
  *keep businesses separate* and *separate admin access from customer access*.
- **It is plain Postgres underneath.** The schema lives in portable SQL migrations, so lock-in is low. If iSectAI
  later leaves Supabase, the schema, data and most RLS policies move with it; only the Auth integration changes.
- **TypeScript end to end** (types generated from the schema via `npm run db:types`) keeps the data layer and UI in sync.

## 2. How the design supports many businesses and industries

One shared database, organised into **three schemas**:

```
core            industries 1─* businesses 1─* locations / staff / customers / activity_events
                platform_admins, business_members            (who may sign in)
medical         appointments    ─* businesses                (clinic records)
field_service   jobs            ─* businesses                (plumbing / HVAC / electrical records)
```

- **`core` is industry-agnostic.** Locations, staff and customers look the same in every industry, so they live once.
- **Each industry gets its own schema** for its own records, with its own fields and lifecycle: clinics book
  `medical.appointments`, service companies dispatch `field_service.jobs`.
  `core.industries.record_type` tells the UI which table to show.
- **Adding an industry** is one row in `core.industries`. If it needs a new record shape (for example
  `orders`), add a new schema and table that follow the same `business_id` pattern and RLS policies.
  Plumbing, HVAC and electrical all reuse `field_service.jobs`.
- `core.business_stats` is a view that adds up records from both industry schemas, so the Overview
  and Businesses pages need only one query for their numbers.

### Why three schemas (decision log)

| Option | Why not / why |
| --- | --- |
| Everything in `public` | Works, but table names mix shared and industry-specific data and permissions can't be granted per industry |
| One generic `records` table with JSON | Flexible, but no column types, no constraints and no foreign keys on the data that matters most |
| Database or schema per business | Strongest isolation, but each new business means new infrastructure and cross-business reporting gets hard |
| **Shared `core` + one schema per industry (chosen)** | Clear ownership, permissions per industry, new industries don't touch `core`, and all businesses still share one set of tables |

Trade-offs accepted: foreign keys and joins cross schema boundaries, every schema must be exposed to the
API and granted explicitly (see the migrations), and queries name their schema (`.schema('medical')`).

## 3. Keeping each business's data separate and secure

- Every tenant-owned row carries **`business_id`**.
- **Composite foreign keys** `(customer_id, business_id) → core.customers(id, business_id)` make cross-tenant
  references impossible at the database level, even if application code has a bug.
- **Row Level Security** is enabled on every table. Customer users see only rows whose `business_id` is in
  their `core.business_members` rows. Signed-out visitors get no schema permissions at all.
- Isolation is enforced by Postgres, **not** by UI filters: a forged request from the browser still hits RLS.
- The view uses `security_invoker = true`, so it cannot silently bypass RLS.
- The **service-role key** (which bypasses RLS) is never used by the app or exposed to the browser.

## 4. Internal administrator vs customer access

| | iSectAI administrator | Customer user |
| --- | --- | --- |
| Identity table | `core.platform_admins` | `core.business_members` |
| Scope | Read all businesses | Only their own business |
| Entry point | This console (`/login`) | Each business's own portal (not built) |
| Enforced by | `public.is_platform_admin()` in RLS + app guard | `public.current_user_business_ids()` in RLS |

- Signing in is not enough: `signInAction` and the dashboard layout both check `core.platform_admins`.
  The seeded customer account (`office@lakefront.example`) demonstrates the rejection.
- Admin and customer accounts are kept in separate tables on purpose, so a mistake in customer permissions
  cannot hand out admin access.
- Admins can read every tenant table. In this prototype they can change only businesses and industries,
  plus their own admin profile (migration 4, `admin_self_profile`).
- Self-sign-up is disabled (`config.toml`), so staff accounts are provisioned by an administrator.
- The customer policies exist in the database but no customer portal does yet, and they are not covered by automated tests.

## 5. Advantages and limitations

**Advantages** — one shared core to migrate and monitor; industries stay tidy in their own schemas;
cross-business reporting is a simple query; cheap to onboard a new business (a row, not a database);
isolation enforced in one place (RLS); standard Postgres tooling.

**Limitations** — all tenants share compute and a noisy neighbour can affect others; RLS policies must be
written and *tested* carefully (a missing policy is a leak); each new industry schema must be exposed and
granted by hand; very large tenants may eventually need partitioning or their own database; per-tenant
backup/restore is harder than with database-per-tenant; medical data needs compliance work beyond a prototype.

## 6. What I would add for production

1. **Mandatory MFA** for platform admins; SSO (SAML) for iSectAI staff; an `app_role` claim added through a
   Custom Access Token Hook.
2. **Automated RLS tests** (pgTAP) proving tenant A can never read tenant B, in every schema.
3. **Audit log** written by database triggers (who changed what, when) plus admin "view as" tracking.
4. **Partitioning / indexes** on `medical.appointments`, `field_service.jobs` and `core.activity_events` as volume grows.
5. **Server-side pagination, search and exports** with rate limiting; background jobs for health/uptime sync.
6. **Environments**: separate dev / staging / prod projects, migrations through CI, secrets in a vault,
   point-in-time recovery enabled, and per-business data export / deletion tooling.
7. **Observability**: error tracking, structured logs, uptime checks behind the "Business health" numbers.

## 7. Reproducing the demo

See the README: the four migrations create the three schemas, permissions, RLS, the `business_stats` view
and the admin self-profile access; `supabase/seed.sql` loads two clinics and one plumbing/HVAC business
with fictional data.