import clsx from 'clsx'
import styles from './Badge.module.css'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'new' | 'beta' | 'coming-soon' | 'deprecated' | 'mono'
  className?: string
}

const variantMap: Record<string, string> = {
  default: styles.default,
  new: styles.new,
  beta: styles.beta,
  'coming-soon': styles.comingSoon,
  deprecated: styles.deprecated,
  mono: styles.mono,
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={clsx(styles.badge, variantMap[variant], className)}>
      {children}
    </span>
  )
}
