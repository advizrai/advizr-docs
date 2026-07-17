import clsx from 'clsx'

import { DimensionLine } from '@/components/ui/dimension-line'

interface HeroProps {
  title: string
  description?: string
  /** Small mono label rendered above the title */
  eyebrow?: string
  /** Deprecated (pre-Instrument-Grade gradient phrase) — accepted, ignored. */
  highlight?: string
  centered?: boolean
  children?: React.ReactNode
  className?: string
}

/**
 * Hero — full-bleed band set-piece (PR-D). A dark ops-console strip in BOTH
 * worlds: on paper it reads as a `.band` section, on band it merges with the
 * page. The band token re-scope pins every child (eyebrow, buttons,
 * DimensionLine) to band-world values regardless of the page world.
 * bg-grid-fade schematic watermark, mono eyebrow, Geist 600 headline at
 * -0.02em, actions row (one signal CTA + one hairline ghost per content),
 * DimensionLine closing detail. No gradients, no glow, no entrance motion.
 */
export function Hero({
  title,
  description,
  eyebrow,
  highlight: _highlight,
  centered = true,
  children,
  className,
}: HeroProps) {
  return (
    <section
      className={clsx(
        // NOTE: no overflow-hidden — it would create a BFC that shrinks to
        // fit beside the floated CopyPageMenu chip (130px lost on the right).
        'relative border-b border-[hsl(var(--band-hairline))] bg-[hsl(var(--band))]',
        // Band-world re-scope: children resolve tokens to the band ladder in
        // both worlds (same recipe as the mdx-theme pre frame).
        '[--background:var(--band)] [--border:var(--band-hairline)]',
        '[--card:var(--band-card)] [--secondary:40_12%_11%]',
        '[--text-1:40_71.8%_97.1%] [--text-2:40_8%_75.3%] [--text-3:40_3.8%_51.2%]',
        '[--muted-foreground:40_3.8%_51.2%] [--grid-color:40_11%_12%]',
        '[--signal:12_95%_66%] [--signal-text:12_95%_66%]',
        centered ? 'text-center' : 'text-left',
        className
      )}
    >
      <div aria-hidden="true" className="bg-grid-fade absolute inset-0" />
      <div className="relative mx-auto flex max-w-5xl flex-col px-6 pb-12 pt-20 md:pt-24">
        {eyebrow && <p className="eyebrow m-0">{eyebrow}</p>}
        <h1 className="mt-4 text-[clamp(1.75rem,3vw+1rem,2.75rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[hsl(var(--text-1))]">
          {title}
        </h1>
        {description && (
          <p
            className={clsx(
              'mt-5 max-w-[52ch] text-[1.0625rem] leading-[1.65] text-[hsl(var(--text-2))]',
              centered && 'mx-auto'
            )}
          >
            {description}
          </p>
        )}
        {children && (
          <div
            className={clsx(
              'mt-8 flex flex-wrap items-center gap-3',
              centered && 'justify-center'
            )}
          >
            {children}
          </div>
        )}
        <DimensionLine label="Advizr docs" className="mt-16" />
      </div>
    </section>
  )
}
