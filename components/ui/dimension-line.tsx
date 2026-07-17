import * as React from "react"

import { cn } from "@/lib/cn"

/**
 * Instrument Grade dimension line.
 * Ported verbatim from advizr-client-template components/ui/dimension-line.tsx.
 *
 * Technical-drawing annotation: |———  LABEL  ———| — hairline segments with
 * 8px perpendicular end ticks framing a centered mono label. Purely
 * presentational; hidden from assistive tech.
 */
function Segment({ side }: { side: "start" | "end" }) {
  return (
    <span className="relative h-2 min-w-4 flex-1">
      {/* perpendicular end tick (8px) */}
      <span
        className={cn(
          "absolute top-0 h-2 w-px bg-border",
          side === "start" ? "left-0" : "right-0"
        )}
      />
      {/* hairline */}
      <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border" />
    </span>
  )
}

function DimensionLine({
  label,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  label: string
}) {
  return (
    <div
      data-slot="dimension-line"
      aria-hidden="true"
      className={cn("flex w-full items-center gap-2", className)}
      {...props}
    >
      <Segment side="start" />
      <span className="shrink-0 whitespace-nowrap font-mono text-[10px] font-normal uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </span>
      <Segment side="end" />
    </div>
  )
}

export { DimensionLine }
