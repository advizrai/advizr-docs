'use client'

import { useEffect, useRef, useState } from 'react'
import { useCountUp } from '../../hooks/useCountUp'
import { cn } from '@/lib/cn'

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
 * Stat — StatNumeral treatment (PR-E): Geist Mono tabular numeral, mono
 * uppercase 11px label, no color theatrics. Counts once when scrolled into
 * view; reduced-motion renders the final value immediately.
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
    <div
      ref={ref}
      className={cn('flex flex-col gap-1.5 bg-[hsl(var(--background))] px-5 py-4', className)}
    >
      <span className="font-mono font-tabular text-[clamp(1.75rem,1.25rem+1.5vw,2.5rem)] font-medium leading-none text-[hsl(var(--foreground))]">
        {prefix}
        {display.toFixed(places)}
        {suffix && (
          <span className="text-[0.6em] text-[hsl(var(--text-3))]">{suffix}</span>
        )}
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[hsl(var(--text-3))]">
        {label}
      </span>
    </div>
  )
}

/**
 * StatRow — hairline-divided ledger strip: 1px gaps over the border token
 * read as drawn dividers between the stat cells.
 */
export function StatRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'my-8 grid grid-cols-2 gap-px border border-border bg-[hsl(var(--border))] md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]',
        className
      )}
    >
      {children}
    </div>
  )
}
