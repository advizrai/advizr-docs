import * as React from 'react'

import { cn } from '@/lib/cn'

/**
 * Callout — ONE neutral variant (adoption-map §4.1): card-surface band, 1px
 * hairline, 12/16px padding, 0 radius, no icon; an optional mono Eyebrow
 * label. Warn gets a 2px --signal left edge, danger a --destructive edge —
 * the signal-edge, never a tinted surface. Body text --text-2.
 *
 * Exported for reuse: this is the mdx-theme element for blockquote-style
 * callouts; the full MDX kit redesign (PR-E) composes these same variants.
 */

type CalloutVariant = 'note' | 'warn' | 'danger'

interface CalloutProps extends React.ComponentProps<'div'> {
  variant?: CalloutVariant
  /** Optional mono eyebrow label, e.g. "NOTE" / "BEFORE YOU START". */
  label?: string
}

const EDGE: Record<CalloutVariant, string> = {
  note: '',
  warn: 'border-l-2 border-l-[hsl(var(--signal))]',
  danger: 'border-l-2 border-l-[hsl(var(--destructive))]',
}

function Callout({
  variant = 'note',
  label,
  className,
  children,
  ...props
}: CalloutProps) {
  return (
    <div
      data-slot="docs-callout"
      data-variant={variant}
      className={cn(
        'my-6 border border-border bg-[hsl(var(--card))] px-4 py-3 text-[hsl(var(--text-2))]',
        EDGE[variant],
        className
      )}
      {...props}
    >
      {label && <span className="eyebrow mb-1.5 block">{label}</span>}
      <div className="[&>p]:my-0 [&>p+p]:mt-2">{children}</div>
    </div>
  )
}

export { Callout }
export type { CalloutProps, CalloutVariant }
