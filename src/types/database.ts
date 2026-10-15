/**
 * Database types for the iSectAI Control Center.
 *
 * Hand-written to match supabase/migrations so the project type-checks out of the box.
 * Once your database is running, regenerate with:   npm run db:types
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type RecordType = 'appointment' | 'job'
export type BusinessPlan = 'starter' | 'growth' | 'professional'
export type BusinessStatus = 'onboarding' | 'active' | 'paused' | 'suspended'
export type AppointmentStatus = 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | 'no_show'
export type JobStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
export type PlatformAdminRole = 'platform_admin' | 'support'
export type BusinessMemberRole = 'owner' | 'manager' | 'member'

type IndustryRow = {
  id: string
  slug: string
  name: string
  sector: string
  record_type: RecordType
  record_label: string
  created_at: string
}

type BusinessRow = {
  id: string
  industry_id: string
  tenant_code: string
  name: string
  legal_name: string
  primary_contact: string
  email: string
  phone: string
  city: string
  state: string
  timezone: string
  plan: BusinessPlan
  status: BusinessStatus
  uptime_pct: number
  storage_used_gb: number
  storage_limit_gb: number
  joined_at: string
  created_at: string
}

type LocationRow = {
  id: string
  business_id: string
  name: string
  address_line: string
  city: string
  state: string
  postal_code: string
  is_primary: boolean
  created_at: string
}

type StaffRow = {
  id: string
  business_id: string
  location_id: string | null
  full_name: string
  role: string
  is_provider: boolean
  is_active: boolean
  created_at: string
}

type CustomerRow = {
  id: string
  business_id: string
  display_name: string
  contact_email: string | null
  phone: string | null
  created_at: string
}

type AppointmentRow = {
  id: string
  business_id: string
  location_id: string
  customer_id: string
  provider_id: string | null
  visit_type: string
  starts_at: string
  status: AppointmentStatus
  created_at: string
}

type JobRow = {
  id: string
  business_id: string
  location_id: string
  customer_id: string
  technician_id: string | null
  service_type: string
  service_address: string
  scheduled_at: string
  status: JobStatus
  created_at: string
}

type ActivityEventRow = {
  id: string
  business_id: string
  event_type: string
  title: string
  detail: string | null
  created_at: string
}

type PlatformAdminRow = {
  user_id: string
  full_name: string
  role: PlatformAdminRole
  created_at: string
}

type BusinessMemberRow = {
  user_id: string
  business_id: string
  role: BusinessMemberRole
  created_at: string
}

type BusinessStatsRow = {
  business_id: string
  records_30d: number
  open_records: number
  staff_count: number
  customer_count: number
}

type TableDef<Row> = {
  Row: Row
  Insert: Partial<Row>
  Update: Partial<Row>
  Relationships: []
}

export type Database = {
  // `public` now only holds helper functions. Every table lives in its own schema below.
  public: {
    Tables: { [_ in never]: never }
    Views: { [_ in never]: never }
    Functions: {
      is_platform_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
  core: {
    Tables: {
      industries: TableDef<IndustryRow>
      businesses: TableDef<BusinessRow>
      business_members: TableDef<BusinessMemberRow>
      locations: TableDef<LocationRow>
      staff: TableDef<StaffRow>
      customers: TableDef<CustomerRow>
      platform_admins: TableDef<PlatformAdminRow>
      activity_events: TableDef<ActivityEventRow>
    }
    Views: {
      business_stats: { Row: BusinessStatsRow; Relationships: [] }
    }
    Functions: { [_ in never]: never }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
  medical: {
    Tables: {
      appointments: TableDef<AppointmentRow>
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
  field_service: {
    Tables: {
      jobs: TableDef<JobRow>
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Table names are unique across schemas, so these helpers keep working without a schema argument.
type AllTables = Database['core']['Tables'] & Database['medical']['Tables'] & Database['field_service']['Tables']
type AllViews = Database['core']['Views']

/** Row type of a table, e.g. Tables<'businesses'>. */
export type Tables<T extends keyof AllTables> = AllTables[T]['Row']
/** Row type of a view, e.g. Views<'business_stats'>. */
export type Views<T extends keyof AllViews> = AllViews[T]['Row']