import clsx from 'clsx'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Icon } from './Icon'
import styles from './Feature.module.css'

interface FeatureProps {
  /** Registry icon name (see icon-registry.ts) or a custom node. Emoji are banned. */
  icon: string | ReactNode
  title: string
  description: string
  href?: string
  className?: string
}

export function Feature({ icon, title, description, href, className }: FeatureProps) {
  const content = (
    <>
      <span className={styles.icon}>
        {typeof icon === 'string' ? <Icon name={icon} size={20} /> : icon}
      </span>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={clsx(styles.feature, className)}>
        {content}
      </Link>
    )
  }

  return (
    <div className={clsx(styles.feature, className)}>
      {content}
    </div>
  )
}
