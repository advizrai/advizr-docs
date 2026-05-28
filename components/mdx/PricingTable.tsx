'use client'

import clsx from 'clsx'
import styles from './PricingTable.module.css'
import { BookCallButton } from './BookCallButton'

interface Tier {
  name: string
  price: string
  description: string
  recommended?: boolean
}

const TIERS: Tier[] = [
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

interface Feature {
  name: string
  values: (boolean | string)[]
}

const FEATURES: Feature[] = [
  { name: 'AI Build', values: [true, true, true] },
  { name: 'Education Sessions', values: ['2/month', '4/month', 'Unlimited'] },
  { name: 'Advisory Calls', values: ['Monthly', 'Bi-weekly', 'Weekly'] },
  { name: 'Proprietary Software', values: [false, true, true] },
  { name: 'Custom Workflows', values: [false, true, true] },
  { name: 'Change Management', values: [false, false, true] },
  { name: 'Ongoing Support', values: ['Email', 'Priority', 'Dedicated'] },
  { name: 'Quarterly Reviews', values: [false, true, true] },
]

function CheckIcon() {
  return (
    <svg className={styles.checkIcon} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="Included">
      <path d="M4 9.5l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg className={styles.xIcon} width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="Not included">
      <path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value ? <CheckIcon /> : <XIcon />
  }
  return <span className={styles.textValue}>{value}</span>
}

interface PricingTableProps {
  className?: string
}

export function PricingTable({ className }: PricingTableProps) {
  return (
    <div className={clsx(styles.wrapper, className)}>
      {/* Desktop table */}
      <div className={styles.table}>
        {/* Header row */}
        <div className={styles.headerRow}>
          <div className={styles.featureHeader} />
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={clsx(styles.tierHeader, tier.recommended && styles.recommended)}
            >
              {tier.recommended && (
                <span className={styles.badge}>Recommended</span>
              )}
              <span className={styles.tierName}>{tier.name}</span>
              <span className={styles.tierPrice}>{tier.price}</span>
            </div>
          ))}
        </div>

        {/* Feature rows */}
        {FEATURES.map((feature, i) => (
          <div
            key={feature.name}
            className={clsx(styles.featureRow, i % 2 === 1 && styles.altRow)}
          >
            <div className={styles.featureName}>{feature.name}</div>
            {feature.values.map((value, j) => (
              <div
                key={TIERS[j].name}
                className={clsx(styles.featureCell, TIERS[j].recommended && styles.recommendedCol)}
              >
                <CellValue value={value} />
              </div>
            ))}
          </div>
        ))}

        {/* CTA row */}
        <div className={styles.ctaRow}>
          <div className={styles.featureHeader} />
          {TIERS.map((tier) => (
            <div key={tier.name} className={styles.ctaCell}>
              <BookCallButton
                text={`Choose ${tier.name}`}
                variant={tier.recommended ? 'primary' : 'secondary'}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className={styles.mobileCards}>
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={clsx(styles.mobileCard, tier.recommended && styles.recommendedCard)}
          >
            <div className={styles.mobileCardHeader}>
              {tier.recommended && (
                <span className={styles.badge}>Recommended</span>
              )}
              <span className={styles.tierName}>{tier.name}</span>
              <span className={styles.tierPrice}>{tier.price}</span>
            </div>
            <div className={styles.mobileFeatures}>
              {FEATURES.map((feature) => {
                const value = feature.values[TIERS.indexOf(tier)]
                return (
                  <div key={feature.name} className={styles.mobileFeatureRow}>
                    <span className={styles.mobileFeatureName}>{feature.name}</span>
                    <span className={styles.mobileFeatureValue}>
                      <CellValue value={value} />
                    </span>
                  </div>
                )
              })}
            </div>
            <div className={styles.mobileCtaWrap}>
              <BookCallButton
                text={`Choose ${tier.name}`}
                variant={tier.recommended ? 'primary' : 'secondary'}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
