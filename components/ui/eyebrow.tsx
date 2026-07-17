import * as React from "react"

import { cn } from "@/lib/cn"

/**
 * Instrument Grade eyebrow.
 * Ported verbatim from advizr-client-template components/ui/eyebrow.tsx.
 *
 * Mono uppercase 11px tracked section label. `withPort` prefixes the 6px
 * signal port — rendered SQUARE here (the machined variant of the port-dot
 * utility). Signal is rationed: use the port only on the active/selected
 * section label.
 */
function Eyebrow({
  children,
  withPort = false,
  className,
  ...props
}: React.ComponentProps<"span"> & {
  withPort?: boolean
}) {
  return (
    <span
      data-slot="eyebrow"
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[11px] font-normal uppercase tracking-[0.08em] text-muted-foreground",
        className
      )}
      {...props}
    >
      {withPort && (
        <span
          aria-hidden="true"
          className="size-1.5 shrink-0 bg-[hsl(var(--signal))]"
        />
      )}
      {children}
    </span>
  )
}

export { Eyebrow }
