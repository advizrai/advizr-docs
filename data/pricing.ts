/**
 * Pricing data — single source of truth.
 *
 * Consumed by components/mdx/PricingTable.tsx and importable from MDX
 * content pages. Edit tiers/features here, never inline in components.
 */

export interface PricingTier {
  name: string
  /**
   * What the tier is for, in plain words. There is deliberately no `price`
   * field: no literal prices appear anywhere on this site (see the price-gate
   * rule in scripts/check-claims.mjs). Engagements are fixed scope, quoted in
   * writing after the audit call.
   */
  positioning: string
  description: string
  recommended?: boolean
}

export const TIERS: PricingTier[] = [
  {
    name: 'Catalyst',
    positioning: 'One system, built and running',
    description: 'Entry-level AI engagement to get started fast.',
  },
  {
    name: 'Acceleration',
    positioning: 'Several systems, plus training',
    description: 'Deeper builds with training and proprietary tools.',
  },
  {
    name: 'Partnership',
    positioning: 'Continuous build, full curriculum',
    description: 'Full transformation with dedicated support.',
    recommended: true,
  },
]

export interface PricingFeature {
  name: string
  /** One value per tier, in TIERS order. */
  values: (boolean | string)[]
}

// Rows mirror the detailed tables on services/pricing/whats-included —
// if you change one, change both (audit 2026-06 found them contradicting).
export const FEATURES: PricingFeature[] = [
  { name: 'AI Build', values: ['Single system', 'Multiple systems', 'Comprehensive'] },
  { name: 'Live Sessions', values: ['Kickoff + workshop', '5 session types', 'All 9 session types'] },
  { name: 'Coaching Calls', values: ['2-3', '4', '6-8'] },
  { name: 'Monthly Advisory', values: [false, false, true] },
  { name: 'Curriculum Phases', values: ['Phases 1-2', 'Phases 1-3', 'All 4 + change mgmt'] },
  { name: 'Proprietary Software', values: [false, true, true] },
  { name: 'Custom Workflows', values: ['Project scope', true, true] },
  { name: 'Ongoing Support', values: ['Email', 'Priority', 'Dedicated'] },
]

/** Look up a tier by name (case-insensitive). */
export function getTier(name: string): PricingTier | undefined {
  return TIERS.find((tier) => tier.name.toLowerCase() === name.toLowerCase())
}

/** The featured/recommended tier, if one is flagged. */
export function getRecommendedTier(): PricingTier | undefined {
  return TIERS.find((tier) => tier.recommended)
}
