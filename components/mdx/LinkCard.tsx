import Link from 'next/link'
import clsx from 'clsx'
import styles from './LinkCard.module.css'

interface LinkCardProps {
  title: string
  description?: string
  href: string
  icon?: string
  className?: string
}

const isExternal = (href: string) => href.startsWith('http')

export function LinkCard({ title, description, href, icon, className }: LinkCardProps) {
  const external = isExternal(href)
  const Component = external ? 'a' : Link
  const externalProps = external ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {}

  return (
    <Component href={href} className={clsx(styles.linkCard, className)} {...externalProps}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <div className={styles.body}>
        <span className={styles.title}>{title}</span>
        {description && <span className={styles.description}>{description}</span>}
      </div>
      <svg
        className={styles.arrow}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Component>
  )
}
