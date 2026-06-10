'use client'

import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { useCountUp } from '../../hooks/useCountUp'
import styles from './Stat.module.css'

interface StatProps {
  /** Numeric value to count up to (e.g. 4.1, 92, 1500) */
  value: number
  /** Rendered before the number, e.g. "$" */
  prefix?: string
  /** Rendered after the number, e.g. "x", "%", "+" */
  suffix?: string
  /** Short label under the number */
  label: string
  /** Decimal places to render (default: inferred from value) */
  decimals?: number
  className?: string
}

/**
 * Count-up statistic — one of the three B6 signature set-pieces.
 * Counts once when scrolled into view; tabular numerals prevent layout
 * shift; reduced-motion renders the final value immediately.
 */
export function Stat({ value, prefix = '', suffix = '', label, decimals, className }: StatProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const places = decimals ?? (Number.isInteger(value) ? 0 : 1)
  const display = useCountUp(value, inView)

  return (
    <div ref={ref} className={clsx(styles.stat, className)}>
      <span className={styles.value}>
        {prefix}
        {display.toFixed(places)}
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}

/** Layout row for a group of Stats */
export function StatRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx(styles.row, className)}>{children}</div>
}
