import clsx from 'clsx'
import { Icon } from './Icon'
import styles from './IconBox.module.css'

interface IconBoxProps {
  name: string
  size?: 'sm' | 'md'
  className?: string
}

/**
 * Tinted 40px container for design-system icons — the standard treatment
 * for card/feature icons. Tint and icon color follow --section-accent so
 * icons pick up section identity automatically.
 */
export function IconBox({ name, size = 'md', className }: IconBoxProps) {
  return (
    <span className={clsx(styles.iconBox, size === 'sm' && styles.sm, className)}>
      <Icon name={name} size={size === 'sm' ? 16 : 20} />
    </span>
  )
}
