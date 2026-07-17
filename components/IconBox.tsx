import clsx from 'clsx'

import { Icon } from './Icon'

interface IconBoxProps {
  name: string
  size?: 'sm' | 'md'
  className?: string
}

/**
 * 1px hairline square for design-system icons (PR-D) — no tinted fill, 0
 * radius. Icon color follows --section-accent so icons pick up section
 * identity automatically (falls back to --text-2).
 */
export function IconBox({ name, size = 'md', className }: IconBoxProps) {
  return (
    <span
      className={clsx(
        'inline-flex shrink-0 items-center justify-center border border-border text-[color:var(--section-accent,hsl(var(--text-2)))]',
        size === 'sm' ? 'size-8' : 'size-10',
        className
      )}
    >
      <Icon name={name} size={size === 'sm' ? 16 : 20} />
    </span>
  )
}
