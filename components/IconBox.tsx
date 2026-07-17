import clsx from 'clsx'

import { Icon } from './Icon'

interface IconBoxProps {
  name: string
  size?: 'sm' | 'md'
  className?: string
}

/**
 * 1px hairline square for design-system icons (PR-D) — no tinted fill, 0
 * radius. Neutral --text-2 icon ink (PR-E killed the section-accent hues).
 */
export function IconBox({ name, size = 'md', className }: IconBoxProps) {
  return (
    <span
      className={clsx(
        'inline-flex shrink-0 items-center justify-center border border-border text-[hsl(var(--text-2))]',
        size === 'sm' ? 'size-8' : 'size-10',
        className
      )}
    >
      <Icon name={name} size={size === 'sm' ? 16 : 20} />
    </span>
  )
}
