/**
 * Pricing data — single source of truth.
 *
 * Consumed by components/mdx/PricingTable.tsx and importable from MDX
 * content pages. Edit tiers/features here, never inline in components.
 */

export interface PricingTier {
  name: string
  price: string
  description: string
  recommended?: boolean
}

export const TIERS: PricingTier[] = [
  {
    name: 'Catalyst',
    price: '$3-5k initial + $500-1k/mo',
    description: 'Entry-level AI engagement to get started fast.',
  },
  {
    name: 'Acceleration',
    price: '$5-10k initial + $1-3k/mo',
    description: 'Deeper builds with training and proprietary tools.',
  },
  {
    name: 'Partnership',
    price: '$10k+ initial + $3-5k/mo',
    description: 'Full transformation with dedicated support.',
    recommended: true,
  },
]

export interface PricingFeature {
  name: string
  /** One value per tier, in TIERS order. */
  values: (boolean | string)[]
}

export const FEATURES: PricingFeature[] = [
  { name: 'AI Build', values: [true, true, true] },
  { name: 'Education Sessions', values: ['2/month', '4/month', 'Unlimited'] },
  { name: 'Advisory Calls', values: ['Monthly', 'Bi-weekly', 'Weekly'] },
  { name: 'Proprietary Software', values: [false, true, true] },
  { name: 'Custom Workflows', values: [false, true, true] },
  { name: 'Change Management', values: [false, false, true] },
  { name: 'Ongoing Support', values: ['Email', 'Priority', 'Dedicated'] },
  { name: 'Quarterly Reviews', values: [false, true, true] },
]

/** Look up a tier by name (case-insensitive). */
export function getTier(name: string): PricingTier | undefined {
  return TIERS.find((tier) => tier.name.toLowerCase() === name.toLowerCase())
}

/** The featured/recommended tier, if one is flagged. */
export function getRecommendedTier(): PricingTier | undefined {
  return TIERS.find((tier) => tier.recommended)
}
