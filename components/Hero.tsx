import clsx from 'clsx'
import styles from './Hero.module.css'

interface HeroProps {
  title: string
  description?: string
  /** Small mono label rendered above the title */
  eyebrow?: string
  /** Substring of `title` to render as a gradient phrase */
  highlight?: string
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

function renderTitle(title: string, highlight?: string): React.ReactNode {
  if (!highlight) return title
  const start = title.indexOf(highlight)
  if (start === -1) return title
  const end = start + highlight.length
  return (
    <>
      {title.slice(0, start)}
      <span className={styles.highlight}>{title.slice(start, end)}</span>
      {title.slice(end)}
    </>
  )
}

export function Hero({
  title,
  description,
  eyebrow,
  highlight,
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
        {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
        <h1 className={styles.title}>{renderTitle(title, highlight)}</h1>
        {description && <p className={styles.description}>{description}</p>}
        {children && <div className={styles.actions}>{children}</div>}
      </div>
    </section>
  )
}
