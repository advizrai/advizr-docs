'use client'

import clsx from 'clsx'
import styles from './PricingTable.module.css'
import { BookCallButton } from './BookCallButton'
import { TIERS, FEATURES } from '@/data/pricing'

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
  return <span className={clsx(styles.textValue, 'advizr-num')}>{value}</span>
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
                <span className={styles.eyebrow}>Most Popular</span>
              )}
              <span className={styles.tierName}>{tier.name}</span>
              <span className={clsx(styles.tierPrice, 'advizr-num')}>{tier.price}</span>
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
                <span className={styles.eyebrow}>Most Popular</span>
              )}
              <span className={styles.tierName}>{tier.name}</span>
              <span className={clsx(styles.tierPrice, 'advizr-num')}>{tier.price}</span>
            </div>
            <div className={styles.mobileFeatures}>
              {FEATURES.map((feature) => {
                const value = feature.values[TIERS.indexOf(tier)]
                return (
                  <div key={feature.name} className={styles.mobileFeatureRow}>
                    <span className={styles.mobileFeatureName}>{feature.name}</span>
                    <span className={clsx(styles.mobileFeatureValue, 'advizr-num')}>
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
