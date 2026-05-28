import clsx from 'clsx'
import Link from 'next/link'
import styles from './Card.module.css'

interface CardProps {
  title: string
  description?: string
  href?: string
  icon?: string
  image?: string
  variant?: 'default' | 'action' | 'outline' | 'ghost'
  arrow?: boolean
  children?: React.ReactNode
  className?: string
}

const variantMap: Record<string, string> = {
  default: styles.default,
  action: styles.action,
  outline: styles.outline,
  ghost: styles.ghost,
}

export function Card({
  title,
  description,
  href,
  icon,
  image,
  variant = 'default',
  arrow = false,
  children,
  className,
}: CardProps) {
  const content = (
    <>
      {image && <img src={image} alt="" className={styles.image} />}
      {icon && <span className={styles.icon}>{icon}</span>}
      <h3 className={styles.title}>
        {title}
        {arrow && <span className={styles.arrow}>&rarr;</span>}
      </h3>
      {(description || children) && (
        <div className={styles.body}>
          {description}
          {children}
        </div>
      )}
    </>
  )

  const cls = clsx(styles.card, variantMap[variant], className)

  if (href) {
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    )
  }

  return (
    <div className={cls}>
      {content}
    </div>
  )
}
