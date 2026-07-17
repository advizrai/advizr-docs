import * as React from "react"

import { cn } from "@/lib/cn"

/**
 * Instrument Grade status glyph.
 * Ported verbatim from advizr-client-template components/ui/status-glyph.tsx
 * (the status-dot-pulse utility it uses is inlined in styles/theme.css).
 *
 * Status is never a colored pill fill — it is a small machined glyph plus
 * an optional mono label. Each state has a distinct SHAPE (not just color)
 * so the legend survives grayscale and color-blindness:
 *
 *   delivered  solid ink-success square
 *   running    signal diamond, slow pulse
 *   review     warning-hatched square
 *   pending    empty hairline square
 *   failed     solid destructive square
 *   paused     two vertical bars
 */
type StatusGlyphStatus =
  | "delivered"
  | "running"
  | "review"
  | "pending"
  | "failed"
  | "paused"

function Glyph({ status }: { status: StatusGlyphStatus }) {
  switch (status) {
    case "delivered":
      return <span aria-hidden="true" className="size-2.5 shrink-0 bg-success" />
    case "running":
      return (
        <span
          aria-hidden="true"
          className="flex size-2.5 shrink-0 items-center justify-center"
        >
          <span className="status-dot-pulse size-2 rotate-45 bg-[hsl(var(--signal))] motion-reduce:animate-none" />
        </span>
      )
    case "review":
      return (
        <span
          aria-hidden="true"
          className="size-2.5 shrink-0"
          style={{
            background:
              "repeating-linear-gradient(45deg, hsl(var(--warning)) 0px, hsl(var(--warning)) 1.5px, transparent 1.5px, transparent 3.5px)",
          }}
        />
      )
    case "pending":
      return (
        <span
          aria-hidden="true"
          className="size-2.5 shrink-0 border border-border bg-transparent"
        />
      )
    case "failed":
      return (
        <span aria-hidden="true" className="size-2.5 shrink-0 bg-destructive" />
      )
    case "paused":
      return (
        <span
          aria-hidden="true"
          className="h-2.5 w-2 shrink-0 border-l-2 border-r-2 border-muted-foreground"
        />
      )
  }
}

function StatusGlyph({
  status,
  label,
  className,
  ...props
}: React.ComponentProps<"span"> & {
  status: StatusGlyphStatus
  label?: string
}) {
  return (
    <span
      data-slot="status-glyph"
      data-status={status}
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    >
      <Glyph status={status} />
      {label ? (
        <span className="font-mono text-[10.5px] font-normal uppercase tracking-[0.08em] text-muted-foreground">
          {label}
        </span>
      ) : (
        <span className="sr-only">{status}</span>
      )}
    </span>
  )
}

export { StatusGlyph }
export type { StatusGlyphStatus }
