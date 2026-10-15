import type { Tables, Views } from '@/types/database'
import type { ColumnDoc, SchemaGroupDoc, SchemaName, TableDoc, TableName, TableScope, ViewName } from '@/features/architecture/types'

/**
 * Documentation of the database, shown on the Architecture page ("Tables by schema").
 *
 * Column names are checked against `src/types/database.ts` at compile time: if you rename or drop a column and
 * regenerate the types (npm run db:types), `npm run typecheck` points at the line in this file that needs updating.
 * Primary / foreign keys below are written by hand, so keep them in step with supabase/migrations.
 */

function table<Name extends TableName>(
  name: Name,
  schema: SchemaName,
  scope: TableScope,
  summary: string,
  columns: ColumnDoc<keyof Tables<Name> & string>[],
): TableDoc {
  return { name, schema, kind: 'table', scope, summary, columns }
}

function view<Name extends ViewName>(
  name: Name,
  schema: SchemaName,
  summary: string,
  columns: ColumnDoc<keyof Views<Name> & string>[],
): TableDoc {
  return { name, schema, kind: 'view', scope: 'tenant', summary, columns }
}

/** The `business_id` column every tenant-owned table carries. */
const TENANT_KEY = { name: 'business_id', references: 'businesses.id', tenantKey: true } as const

export const SCHEMA_GROUPS: SchemaGroupDoc[] = [
  {
    schema: 'core',
    title: 'core',
    description: 'The shared foundation: who the businesses are, who works there, who they serve, and who may sign in.',
    tone: 'bg-teal-50 text-teal-700',
    tables: [
      table('industries', 'core', 'shared', 'Reference list of industries. Decides whether a business works with appointments or jobs.', [
        { name: 'id', pk: true },
        { name: 'slug' },
        { name: 'name' },
        { name: 'sector' },
        { name: 'record_type' },
        { name: 'record_label' },
        { name: 'created_at' },
      ]),
      table('businesses', 'core', 'root', 'One row per customer of iSectAI. This row is the tenant; every tenant-owned row points back to it.', [
        { name: 'id', pk: true },
        { name: 'industry_id', references: 'industries.id' },
        { name: 'tenant_code' },
        { name: 'name' },
        { name: 'legal_name' },
        { name: 'primary_contact' },
        { name: 'email' },
        { name: 'phone' },
        { name: 'city' },
        { name: 'state' },
        { name: 'timezone' },
        { name: 'plan' },
        { name: 'status' },
        { name: 'uptime_pct' },
        { name: 'storage_used_gb' },
        { name: 'storage_limit_gb' },
        { name: 'joined_at' },
        { name: 'created_at' },
      ]),
      table('locations', 'core', 'tenant', 'Physical sites of a business: clinic offices or service depots.', [
        { name: 'id', pk: true },
        TENANT_KEY,
        { name: 'name' },
        { name: 'address_line' },
        { name: 'city' },
        { name: 'state' },
        { name: 'postal_code' },
        { name: 'is_primary' },
        { name: 'created_at' },
      ]),
      table('staff', 'core', 'tenant', 'People who work for a business. Providers and technicians are staff with is_provider set.', [
        { name: 'id', pk: true },
        TENANT_KEY,
        { name: 'location_id', references: 'locations.id' },
        { name: 'full_name' },
        { name: 'role' },
        { name: 'is_provider' },
        { name: 'is_active' },
        { name: 'created_at' },
      ]),
      table('customers', 'core', 'tenant', 'The people a business serves: patients for clinics, homeowners for service companies.', [
        { name: 'id', pk: true },
        TENANT_KEY,
        { name: 'display_name' },
        { name: 'contact_email' },
        { name: 'phone' },
        { name: 'created_at' },
      ]),
      table('activity_events', 'core', 'tenant', 'Append-only log of what happens in each business. Feeds the Activity page.', [
        { name: 'id', pk: true },
        TENANT_KEY,
        { name: 'event_type' },
        { name: 'title' },
        { name: 'detail' },
        { name: 'created_at' },
      ]),
      table('business_members', 'core', 'tenant', 'Links a signed-in user to one business with a role. This is how customer access is modelled.', [
        { name: 'user_id', references: 'auth.users.id' },
        TENANT_KEY,
        { name: 'role' },
        { name: 'created_at' },
      ]),
      table('platform_admins', 'core', 'platform', 'iSectAI staff who may use this dashboard. A valid sign-in alone is not enough; the user needs a row here.', [
        { name: 'user_id', pk: true, references: 'auth.users.id' },
        { name: 'full_name' },
        { name: 'role' },
        { name: 'created_at' },
      ]),
      view('business_stats', 'core', 'Ready-made counts per business: records in the last 30 days, open records, staff and customers.', [
        { name: 'business_id', references: 'businesses.id', tenantKey: true },
        { name: 'records_30d' },
        { name: 'open_records' },
        { name: 'staff_count' },
        { name: 'customer_count' },
      ]),
    ],
  },
  {
    schema: 'medical',
    title: 'medical',
    description: 'The clinic workflow. Appointments connect a customer, a provider and a location.',
    tone: 'bg-emerald-50 text-emerald-700',
    tables: [
      table('appointments', 'medical', 'tenant', 'A scheduled visit at a medical clinic.', [
        { name: 'id', pk: true },
        TENANT_KEY,
        { name: 'location_id', references: 'locations.id' },
        { name: 'customer_id', references: 'customers.id' },
        { name: 'provider_id', references: 'staff.id' },
        { name: 'visit_type' },
        { name: 'starts_at' },
        { name: 'status' },
        { name: 'created_at' },
      ]),
    ],
  },
  {
    schema: 'field_service',
    title: 'field_service',
    description: 'The service-business workflow. Jobs connect a customer, a technician and a service address.',
    tone: 'bg-amber-50 text-amber-700',
    tables: [
      table('jobs', 'field_service', 'tenant', 'A service call: plumbing, HVAC, electrical and similar.', [
        { name: 'id', pk: true },
        TENANT_KEY,
        { name: 'location_id', references: 'locations.id' },
        { name: 'customer_id', references: 'customers.id' },
        { name: 'technician_id', references: 'staff.id' },
        { name: 'service_type' },
        { name: 'service_address' },
        { name: 'scheduled_at' },
        { name: 'status' },
        { name: 'created_at' },
      ]),
    ],
  },
]

const ALL_TABLES: TableDoc[] = SCHEMA_GROUPS.flatMap((group) => group.tables)
const REAL_TABLES = ALL_TABLES.filter((item) => item.kind === 'table')

export const SCHEMA_COUNT = SCHEMA_GROUPS.length
export const TABLE_COUNT = REAL_TABLES.length
export const VIEW_COUNT = ALL_TABLES.length - REAL_TABLES.length
export const TENANT_TABLE_COUNT = REAL_TABLES.filter((item) => item.scope === 'tenant').length

/** Names of the real tables (not views), in the order the live row counts are shown. */
export const COUNTED_TABLE_NAMES: string[] = REAL_TABLES.map((item) => item.name)

export const SCOPE_META: Record<TableScope, { label: string; hint: string }> = {
  tenant: { label: 'Tenant data', hint: 'business_id on every row' },
  root: { label: 'Tenant root', hint: 'This row is the business itself' },
  shared: { label: 'Shared reference', hint: 'Used by every business' },
  platform: { label: 'Platform staff', hint: 'iSectAI only, not tied to a business' },
}