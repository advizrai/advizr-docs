import * as React from 'react'

import { cn } from '@/lib/cn'

/**
 * Blockquote — signal-edge quote in --text-2, italic-free (emphasis comes
 * from the drawn edge, not slanted type).
 */
function Blockquote({ className, ...props }: React.ComponentProps<'blockquote'>) {
  return (
    <blockquote
      className={cn(
        'signal-edge my-6 py-0.5 pl-4 text-[hsl(var(--text-2))] not-italic',
        className
      )}
      {...props}
    />
  )
}

export { Blockquote }
