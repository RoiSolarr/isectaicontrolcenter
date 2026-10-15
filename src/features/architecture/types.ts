import type { LucideIcon } from 'lucide-react'
import type { Database } from '@/types/database'

/** The two views of the Architecture page. Kept in the URL (?view=security) so each one can be bookmarked or shared. */
export type ArchitectureView = 'database' | 'security'

// ---- Database view -------------------------------------------------------------------------

/** Postgres schemas that hold the prototype's tables. */
export type SchemaName = 'core' | 'medical' | 'field_service'

/** Every table name in `types/database.ts` (table names are unique across schemas). */
export type TableName = keyof Database['core']['Tables'] | keyof Database['medical']['Tables'] | keyof Database['field_service']['Tables']

/** Every view name in `types/database.ts`. */
export type ViewName = keyof Database['core']['Views']

/**
 * Who owns the rows of a table.
 * - tenant:   every row carries `business_id` and belongs to exactly one business
 * - root:     the table IS the tenant (`businesses`)
 * - shared:   reference data every business uses (`industries`)
 * - platform: iSectAI staff only, not tied to any business (`platform_admins`)
 */
export type TableScope = 'tenant' | 'root' | 'shared' | 'platform'

export type ColumnDoc<Name extends string = string> = {
  name: Name
  /** Part of the primary key. */
  pk?: boolean
  /** Foreign key target, written "table.column" (e.g. "businesses.id"). */
  references?: string
  /** True for the `business_id` column that ties a row to its tenant. */
  tenantKey?: boolean
}

export type TableDoc = {
  name: string
  schema: SchemaName
  kind: 'table' | 'view'
  scope: TableScope
  /** One plain-English sentence on what the table is for. */
  summary: string
  columns: ColumnDoc[]
}

export type SchemaGroupDoc = {
  schema: SchemaName
  title: string
  description: string
  /** Tailwind classes for the small coloured tile, so a schema looks the same here and in the diagram legend. */
  tone: string
  tables: TableDoc[]
}

/** Row count per table name; null when that one count failed (e.g. the schema is not exposed). */
export type TableCounts = Record<string, number | null>

export type TableCountsSnapshot = {
  counts: TableCounts
  /** ISO timestamp of when the counts were read. */
  generatedAt: string
}

// ---- ER diagram ----------------------------------------------------------------------------

export type DiagramGroup = SchemaName | 'external'

export type DiagramNode = {
  id: string
  /** Table name without the schema, e.g. "businesses". */
  title: string
  /** Schema prefix shown in lighter type, e.g. "core.". */
  schemaLabel: string
  /** The two or three columns worth knowing about. */
  subtitle: string
  group: DiagramGroup
  /** Top-left corner in diagram units (the SVG viewBox). */
  x: number
  y: number
}

/** A one-to-many link, drawn from the parent table (one) to the child table (many). */
export type DiagramEdge = {
  from: string
  to: string
  /** Dashed = the link goes to Supabase Auth, which is managed outside our schemas. */
  dashed?: boolean
}

export type RoutedEdge = {
  key: string
  from: string
  to: string
  dashed: boolean
  /** SVG path data. */
  path: string
}

// ---- Security & decisions view -------------------------------------------------------------

/** Whether a design point already exists in this prototype or is the plan for production. */
export type BuildStatus = 'built' | 'designed'

export type SeparationLayer = {
  step: number
  title: string
  text: string
  /** Where to look in the code or database. */
  where: string
  status: BuildStatus
  icon: LucideIcon
}

export type RequestStep = {
  title: string
  text: string
  /** File or database object that does this step. */
  where: string
  icon: LucideIcon
}

export type AccessRow = {
  label: string
  admin: string
  customer: string
}

export type RoadmapColumn = {
  id: string
  title: string
  icon: LucideIcon
  items: string[]
}