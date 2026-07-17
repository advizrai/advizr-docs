import * as React from 'react'

import { cn } from '@/lib/cn'

/**
 * Img — plain image, max-w-full, inside a hairline frame (block-level prose
 * images read as figures; the full FigureFrame treatment with corner ticks
 * is the MDX kit's job — PR-E). No radius, no shadow, no zoom theatre.
 */
function Img({ className, alt = '', ...props }: React.ComponentProps<'img'>) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      loading="lazy"
      className={cn('my-6 h-auto max-w-full border border-border', className)}
      {...props}
    />
  )
}

export { Img }
