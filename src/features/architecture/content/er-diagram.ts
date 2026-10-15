import type { DiagramEdge, DiagramGroup, DiagramNode } from '@/features/architecture/types'
import { NODE_HEIGHT, NODE_WIDTH } from '@/features/architecture/utils/diagram-geometry'

/**
 * Layout of the entity-relationship diagram. Coordinates are in SVG units (see ER_VIEW_BOX).
 * Four columns, read left to right: industry -> business -> the business's data -> the workflow records.
 * Every tenant-owned table, including appointments and jobs, also carries business_id (see the legend under the diagram),
 * so those links are not drawn; drawing them would bury the diagram in lines.
 */
const COLUMN_X = { industry: 8, business: 244, data: 500, workflow: 790 } as const
/** Vertical distance between stacked boxes in the "data" column. */
const ROW = 80

export const ER_NODES: DiagramNode[] = [
  { id: 'industries', title: 'industries', schemaLabel: 'core.', subtitle: 'record_type · record_label', group: 'core', x: COLUMN_X.industry, y: 176 },
  { id: 'businesses', title: 'businesses', schemaLabel: 'core.', subtitle: 'tenant_code · plan · status', group: 'core', x: COLUMN_X.business, y: 176 },

  { id: 'locations', title: 'locations', schemaLabel: 'core.', subtitle: 'business_id · is_primary', group: 'core', x: COLUMN_X.data, y: 16 },
  { id: 'staff', title: 'staff', schemaLabel: 'core.', subtitle: 'location_id · is_provider', group: 'core', x: COLUMN_X.data, y: 16 + ROW },
  { id: 'customers', title: 'customers', schemaLabel: 'core.', subtitle: 'business_id · display_name', group: 'core', x: COLUMN_X.data, y: 16 + ROW * 2 },
  { id: 'activity_events', title: 'activity_events', schemaLabel: 'core.', subtitle: 'event_type · title', group: 'core', x: COLUMN_X.data, y: 16 + ROW * 3 },
  { id: 'business_members', title: 'business_members', schemaLabel: 'core.', subtitle: 'customer access · role', group: 'core', x: COLUMN_X.data, y: 16 + ROW * 4 },
  { id: 'platform_admins', title: 'platform_admins', schemaLabel: 'core.', subtitle: 'staff access · role', group: 'core', x: COLUMN_X.data, y: 16 + ROW * 5 },

  { id: 'appointments', title: 'appointments', schemaLabel: 'medical.', subtitle: 'provider_id · starts_at', group: 'medical', x: COLUMN_X.workflow, y: 40 },
  { id: 'jobs', title: 'jobs', schemaLabel: 'field_service.', subtitle: 'technician_id · scheduled_at', group: 'field_service', x: COLUMN_X.workflow, y: 150 },
  { id: 'auth_users', title: 'users', schemaLabel: 'auth.', subtitle: 'Supabase Auth (managed)', group: 'external', x: COLUMN_X.workflow, y: 16 + ROW * 4 + 40 },
]

export const ER_EDGES: DiagramEdge[] = [
  { from: 'industries', to: 'businesses' },

  { from: 'businesses', to: 'locations' },
  { from: 'businesses', to: 'staff' },
  { from: 'businesses', to: 'customers' },
  { from: 'businesses', to: 'activity_events' },
  { from: 'businesses', to: 'business_members' },

  { from: 'locations', to: 'appointments' },
  { from: 'staff', to: 'appointments' },
  { from: 'customers', to: 'appointments' },
  { from: 'locations', to: 'jobs' },
  { from: 'staff', to: 'jobs' },
  { from: 'customers', to: 'jobs' },

  { from: 'business_members', to: 'auth_users', dashed: true },
  { from: 'platform_admins', to: 'auth_users', dashed: true },
]

export const ER_VIEW_BOX = {
  width: COLUMN_X.workflow + NODE_WIDTH + 8,
  height: 16 + ROW * 5 + NODE_HEIGHT + 16,
}

/** Colours per group. Written out in full so Tailwind can see every class. */
export const ER_GROUP_STYLE: Record<DiagramGroup, { box: string; title: string; legend: string; label: string }> = {
  core: { box: 'fill-teal-50 stroke-teal-600', title: 'fill-teal-950', legend: 'border-teal-600 bg-teal-50', label: 'Shared core' },
  medical: { box: 'fill-emerald-50 stroke-emerald-600', title: 'fill-emerald-950', legend: 'border-emerald-600 bg-emerald-50', label: 'Clinic workflow' },
  field_service: { box: 'fill-amber-50 stroke-amber-600', title: 'fill-amber-950', legend: 'border-amber-600 bg-amber-50', label: 'Service workflow' },
  external: { box: 'fill-slate-50 stroke-slate-400', title: 'fill-slate-700', legend: 'border-dashed border-slate-400 bg-slate-50', label: 'Supabase Auth' },
}