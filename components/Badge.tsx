import clsx from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'new' | 'beta' | 'coming-soon' | 'deprecated' | 'mono'
  className?: string
}

/**
 * Badge — square mono chip (PR-D): hairline frame, 0 radius, 11px mono
 * uppercase. Semantics are carried by text color, never by a tinted fill.
 */

const variantMap: Record<string, string> = {
  default: 'text-[hsl(var(--text-2))]',
  new: 'text-[hsl(var(--signal-text))]',
  beta: 'text-[hsl(var(--warning))]',
  'coming-soon': 'text-[hsl(var(--text-3))]',
  deprecated: 'text-[hsl(var(--destructive))]',
  mono: 'text-[hsl(var(--text-2))]',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 whitespace-nowrap border border-border bg-transparent px-1.5 py-px font-mono text-[0.6875rem] uppercase leading-5 tracking-[0.08em]',
        variantMap[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
