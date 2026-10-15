import type { BusinessLocation, BusinessStaffMember, ServerResult } from '@/features/businesses/types'
import { createClient } from '@/lib/supabase/server'

const STAFF_LIMIT = 100

/** Every location of one business, primary location first. */
export async function getBusinessLocations(businessId: string): Promise<ServerResult<BusinessLocation[]>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .schema('core')
      .from('locations')
      .select('id, name, address_line, city, state, postal_code, is_primary')
      .eq('business_id', businessId)
      .order('is_primary', { ascending: false })
      .order('name')
    if (error) throw new Error(error.message)

    return {
      ok: true,
      data: (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        addressLine: row.address_line,
        city: row.city,
        state: row.state,
        postalCode: row.postal_code,
        isPrimary: row.is_primary,
      })),
    }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/** Staff of one business: service providers first, then everyone else, alphabetically. */
export async function getBusinessStaff(businessId: string): Promise<ServerResult<BusinessStaffMember[]>> {
  try {
    const supabase = await createClient()
    const core = supabase.schema('core')

    const [staffRes, locationsRes] = await Promise.all([
      core
        .from('staff')
        .select('id, full_name, role, location_id, is_provider, is_active')
        .eq('business_id', businessId)
        .order('is_provider', { ascending: false })
        .order('full_name')
        .limit(STAFF_LIMIT),
      core.from('locations').select('id, name').eq('business_id', businessId),
    ])
    const firstError = [staffRes.error, locationsRes.error].find(Boolean)
    if (firstError) throw new Error(firstError.message)

    const locationNames = new Map((locationsRes.data ?? []).map((location) => [location.id, location.name]))

    return {
      ok: true,
      data: (staffRes.data ?? []).map((row) => ({
        id: row.id,
        fullName: row.full_name,
        role: row.role,
        locationName: row.location_id ? (locationNames.get(row.location_id) ?? null) : null,
        isProvider: row.is_provider,
        isActive: row.is_active,
      })),
    }
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}