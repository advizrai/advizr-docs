"use client"

import * as React from "react"

import { cn } from "@/lib/cn"

/**
 * FigureFrame — Instrument Grade schematic container.
 *
 * Ported from advizr-client-template components/ui/figure-frame.tsx.
 * Docs doctrine deltas: zero radius on structure (the donor's soft frame and
 * chip radii are dropped — chips are square here), everything else verbatim.
 *
 * Doctrine: hairline-framed structure, bg-card surface, no shadow, no blur.
 * Auto "FIG. NN" numbering scoped per page via FigureProvider; mono 11px
 * chip + revision tag; optional machinist corner ticks. Numbering is
 * assigned once per frame on first render (ref counter + useState
 * initializer) — SSR-render-order stable.
 */

const FigureContext =
  React.createContext<React.MutableRefObject<number> | null>(null)

function FigureProvider({ children }: { children: React.ReactNode }) {
  const counter = React.useRef(0)
  return (
    <FigureContext.Provider value={counter}>{children}</FigureContext.Provider>
  )
}

interface FigureFrameProps extends React.ComponentProps<"figure"> {
  title?: string
  caption?: React.ReactNode
  /** String override for the figure number (replaces the auto two-digit counter). */
  number?: string
  revision?: string
  /** Four 8px L-shaped corner ticks. Default true. */
  cornerTicks?: boolean
  children: React.ReactNode
  className?: string
}

function FigureFrame({
  title,
  caption,
  number,
  revision,
  cornerTicks = true,
  children,
  className,
  ...props
}: FigureFrameProps) {
  const counter = React.useContext(FigureContext)

  // Assigned once on first render; stable across re-renders.
  const [autoNumber] = React.useState<number | null>(() => {
    if (number != null || counter == null) return null
    counter.current += 1
    return counter.current
  })

  const figNumber =
    number ?? (autoNumber != null ? String(autoNumber).padStart(2, "0") : null)
  const hasHeader = Boolean(title) || figNumber != null

  return (
    <figure
      data-slot="figure-frame"
      className={cn("relative border border-border bg-card", className)}
      {...props}
    >
      {cornerTicks && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-px -left-px size-2 border-t-2 border-l-2 border-foreground/40"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-px -right-px size-2 border-t-2 border-r-2 border-foreground/40"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-px -left-px size-2 border-b-2 border-l-2 border-foreground/40"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-px -right-px size-2 border-b-2 border-r-2 border-foreground/40"
          />
        </>
      )}

      {hasHeader && (
        <div
          data-slot="figure-frame-header"
          className="flex items-center justify-between border-b border-border px-4 py-2"
        >
          <div className="flex items-center gap-2.5">
            {figNumber != null && (
              <span className="inline-flex shrink-0 items-center border border-border px-1.5 py-0.5 font-mono text-[11px] leading-none tracking-[0.08em] text-muted-foreground uppercase">
                FIG. {figNumber}
              </span>
            )}
            {title && (
              <span className="text-sm font-medium text-foreground">
                {title}
              </span>
            )}
          </div>
          {revision && (
            <span className="font-mono text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
              {revision}
            </span>
          )}
        </div>
      )}

      <div data-slot="figure-frame-body" className="p-4">
        {children}
      </div>

      {caption != null && (
        <figcaption
          data-slot="figure-frame-caption"
          className="border-t border-border px-4 py-2 font-mono text-[11px] text-muted-foreground"
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

export { FigureProvider, FigureFrame }
