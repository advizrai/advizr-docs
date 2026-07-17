import * as React from 'react'

import { cn } from '@/lib/cn'

/**
 * Kbd — square key chip (adoption-map §4.2): Geist Mono 11px, 1px hairline,
 * 2px radius (control class), 20px min box, 4px horizontal padding,
 * --text-2 on transparent. No fill, no shadow, no bevel.
 */
function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-[2px] border border-border px-1 font-mono text-[11px] font-normal text-[hsl(var(--text-2))]',
        className
      )}
      {...props}
    />
  )
}

export { Kbd }
