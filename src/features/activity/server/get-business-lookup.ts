import { BUSINESS_LOOKUP_LIMIT } from '@/features/activity/constants'
import type { ServerClient } from '@/features/activity/server/events-query'
import type { BusinessLookup } from '@/features/activity/types'

/**
 * Every business (id + name + industry record type), read with the signed-in admin's session.
 * It feeds the business filter and puts a business name on each event, so the events query needs no join.
 * Throws on a database error; the callers turn that into { ok: false, message }.
 */
export async function getBusinessLookup(supabase: ServerClient): Promise<BusinessLookup> {
  const core = supabase.schema('core')

  const [businessesRes, industriesRes] = await Promise.all([
    core.from('businesses').select('id, name, industry_id').order('name', { ascending: true }).limit(BUSINESS_LOOKUP_LIMIT),
    core.from('industries').select('id, record_type'),
  ])

  const firstError = [businessesRes.error, industriesRes.error].find(Boolean)
  if (firstError) throw new Error(firstError.message)

  const recordTypeByIndustry = new Map((industriesRes.data ?? []).map((industry) => [industry.id, industry.record_type]))
  const businesses = businessesRes.data ?? []

  return {
    list: businesses.map((business) => ({ id: business.id, name: business.name })),
    byId: new Map(
      businesses.map((business) => [business.id, { name: business.name, recordType: recordTypeByIndustry.get(business.industry_id) ?? null }]),
    ),
  }
}