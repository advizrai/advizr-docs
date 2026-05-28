import clsx from 'clsx'
import styles from './Hero.module.css'

interface HeroProps {
  title: string
  description?: string
  variant?: 'default' | 'gradient' | 'subtle'
  centered?: boolean
  children?: React.ReactNode
  className?: string
}

const variantMap: Record<string, string | undefined> = {
  default: styles.variantDefault,
  gradient: styles.variantGradient,
  subtle: styles.variantSubtle,
}

export function Hero({
  title,
  description,
  variant = 'default',
  centered = true,
  children,
  className,
}: HeroProps) {
  return (
    <section
      className={clsx(
        styles.hero,
        variantMap[variant],
        !centered && styles.left,
        className,
      )}
    >
      <div className={styles.inner}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
        {children && <div className={styles.actions}>{children}</div>}
      </div>
    </section>
  )
}
