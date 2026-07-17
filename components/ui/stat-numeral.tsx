"use client"

import * as React from "react"

import { useCountUp } from "@/hooks/useCountUp"
import { cn } from "@/lib/cn"

/**
 * StatNumeral — Instrument Grade KPI primitive.
 * Re-implemented for the docs repo on hooks/useCountUp (rAF ease-out count,
 * reduced-motion aware) instead of the template's @number-flow dependency;
 * the component API mirrors advizr-client-template components/ui/stat-numeral.tsx
 * with `format` as Intl.NumberFormatOptions.
 *
 * Doctrine: tabular numerals always; mono uppercase 11px label; signal color
 * is rationed (at most ONE signal stat per section); delta is a small mono
 * glyph + colored text, never a pill fill.
 */

interface StatNumeralProps extends React.ComponentProps<"div"> {
  value: number
  format?: Intl.NumberFormatOptions
  label: string
  /** Rationed accent — at most one signal stat per section. */
  signal?: boolean
  delta?: { value: string; direction: "up" | "down" | "flat" }
  size?: "default" | "xl"
  className?: string
}

const deltaGlyph = {
  up: { glyph: "▲", className: "text-success" },
  down: { glyph: "▼", className: "text-destructive" },
  flat: { glyph: "—", className: "text-muted-foreground" },
} as const

function StatNumeral({
  value,
  format,
  label,
  signal = false,
  delta,
  size = "default",
  className,
  ...props
}: StatNumeralProps) {
  // Count-up starts after hydration so the server render (0) never
  // mismatches; useCountUp itself short-circuits under reduced motion.
  const [started, setStarted] = React.useState(false)
  React.useEffect(() => setStarted(true), [])
  const display = useCountUp(value, started)

  const formatted = React.useMemo(
    () => new Intl.NumberFormat(undefined, format).format(display),
    [display, format]
  )

  return (
    <div
      data-slot="stat-numeral"
      className={cn("flex flex-col gap-1", className)}
      {...props}
    >
      <span
        data-slot="stat-numeral-label"
        className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase"
      >
        {label}
      </span>
      <span
        data-slot="stat-numeral-value"
        className={cn(
          "font-mono tabular-nums",
          size === "xl"
            ? "text-[clamp(2.5rem,2rem+2vw,3.5rem)] leading-none font-medium tracking-[-0.02em]"
            : "text-[length:var(--text-kpi,clamp(1.75rem,1.25rem+1.5vw,2.5rem))] leading-none font-medium",
          signal ? "text-[hsl(var(--signal-text))]" : "text-foreground"
        )}
      >
        {formatted}
      </span>
      {delta && (
        <span
          data-slot="stat-numeral-delta"
          className="font-mono text-[11px] text-muted-foreground"
        >
          <span className={deltaGlyph[delta.direction].className}>
            {deltaGlyph[delta.direction].glyph}
          </span>{" "}
          {delta.value}
        </span>
      )}
    </div>
  )
}

export { StatNumeral }
export type { StatNumeralProps }
