import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/cn"

/**
 * Instrument Grade reference code.
 * Ported from advizr-client-template components/ui/ref-code.tsx.
 * Docs deltas: next/link instead of the template Link wrapper; the linked
 * chip relies on the global :focus-visible signal ring (styles/theme.css)
 * instead of the template's --ring-focus classes; hover is instant-in /
 * 150ms-out per the docs motion canon.
 *
 * Drawing-number style identifier: KIND-0042. Numeric ids are zero-padded
 * to 4 digits. With `href` it becomes a quiet mono link — hover restores
 * ink and underlines; no color shift to signal (refs are wayfinding, not
 * actions).
 */
function formatRefId(id: string | number): string {
  if (typeof id === "number" && Number.isFinite(id)) {
    return String(id).padStart(4, "0")
  }
  const s = String(id)
  return /^\d+$/.test(s) ? s.padStart(4, "0") : s
}

function RefCode({
  kind,
  id,
  href,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "id"> & {
  kind: string
  id: string | number
  href?: string
}) {
  const code = `${kind.toUpperCase()}-${formatRefId(id)}`

  const inner = (
    <span
      data-slot="ref-code"
      className={cn(
        "font-mono text-[11px] font-normal tracking-[0.08em] text-muted-foreground",
        href &&
          "transition-[color] duration-150 ease-out hover:duration-0 hover:text-foreground hover:underline underline-offset-4 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      {code}
    </span>
  )

  if (href) {
    return (
      <Link href={href} data-slot="ref-code-link">
        {inner}
      </Link>
    )
  }

  return inner
}

export { RefCode }
