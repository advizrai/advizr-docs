'use client'

import clsx from 'clsx'
import Link from 'next/link'
import styles from './Button.module.css'

interface ButtonProps {
  children: React.ReactNode
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string
}

const variantMap: Record<string, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
}

const sizeMap: Record<string, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
}

export function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  onClick,
  className,
}: ButtonProps) {
  const cls = clsx(
    styles.button,
    variantMap[variant],
    sizeMap[size],
    className,
  )

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  )
}
