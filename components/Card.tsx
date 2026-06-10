'use client'

import { useRef, type MouseEvent, type ReactNode } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { Icon } from './Icon'
import styles from './Card.module.css'

interface CardProps {
  title: string
  description?: string
  href?: string
  /** Registry icon name (see icon-registry.ts) or a custom node. Emoji are banned. */
  icon?: string | ReactNode
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
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  const content = (
    <>
      {image && <img src={image} alt="" className={styles.image} />}
      {icon && (
        <span className={styles.icon}>
          {typeof icon === 'string' ? <Icon name={icon} size={20} /> : icon}
        </span>
      )}
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
        <div ref={cardRef} onMouseMove={handleMouseMove} className={styles.inner}>
          {content}
        </div>
      </Link>
    )
  }

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} className={cls}>
      {content}
    </div>
  )
}
