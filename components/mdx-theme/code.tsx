import * as React from 'react'

import { cn } from '@/lib/cn'

/**
 * Code — inline code chip: Geist Mono on a muted step, 1px hairline, 2px
 * radius (control-class object). Block code inside [data-docs-pre] is reset
 * to a bare element by prose.css — one component serves both positions.
 */
function Code({ className, ...props }: React.ComponentProps<'code'>) {
  return (
    <code
      className={cn(
        'rounded-[2px] border border-border bg-[hsl(var(--muted))] px-[0.3em] py-[0.1em] font-mono text-[0.85em] text-[hsl(var(--text-1))]',
        className
      )}
      {...props}
    />
  )
}

export { Code }
