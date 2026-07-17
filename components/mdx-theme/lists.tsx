import * as React from 'react'

import { cn } from '@/lib/cn'

/**
 * Lists — plain markers in the world's faint ink; task-list checkboxes are
 * squared by prose.css (`.docs-prose input[type='checkbox']` — filled square
 * = checked, StatusGlyph vocabulary).
 */

function Ul({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      className={cn(
        'my-5 list-disc space-y-2 ps-6 marker:text-[hsl(var(--text-4))]',
        className
      )}
      {...props}
    />
  )
}

function Ol({ className, ...props }: React.ComponentProps<'ol'>) {
  return (
    <ol
      className={cn(
        'my-5 list-decimal space-y-2 ps-6 marker:tabular-nums marker:text-[hsl(var(--text-3))]',
        className
      )}
      {...props}
    />
  )
}

function Li({ className, ...props }: React.ComponentProps<'li'>) {
  return <li className={cn('leading-relaxed', className)} {...props} />
}

export { Ul, Ol, Li }
