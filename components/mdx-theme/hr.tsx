import * as React from 'react'

import { cn } from '@/lib/cn'

/** Hr — a hairline, nothing more. */
function Hr({ className, ...props }: React.ComponentProps<'hr'>) {
  return (
    <hr
      className={cn('my-10 border-0 border-t border-border', className)}
      {...props}
    />
  )
}

export { Hr }
