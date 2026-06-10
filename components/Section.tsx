import clsx from 'clsx'
import styles from './Section.module.css'

interface SectionProps {
  title?: string
  description?: string
  id?: string
  variant?: 'default' | 'muted' | 'highlight' | 'cta'
  /** Scroll-reveal entrance (marketing surfaces only — never article prose) */
  reveal?: boolean
  children: React.ReactNode
  className?: string
}

const variantMap: Record<string, string | undefined> = {
  default: undefined,
  muted: styles.muted,
  highlight: styles.highlight,
  cta: styles.cta,
}

export function Section({
  title,
  description,
  id,
  variant = 'default',
  reveal = false,
  children,
  className,
}: SectionProps) {
  return (
    <section
      className={clsx(styles.section, variantMap[variant], className)}
      id={id}
    >
      <div className={styles.inner} {...(reveal ? { 'data-reveal': '' } : {})}>
        {title && <h2 className={styles.title}>{title}</h2>}
        {description && <p className={styles.description}>{description}</p>}
        {children}
      </div>
    </section>
  )
}
