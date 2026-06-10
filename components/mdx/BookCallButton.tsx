'use client'

import clsx from 'clsx'
import styles from './BookCallButton.module.css'

interface BookCallButtonProps {
  text?: string
  variant?: 'primary' | 'secondary'
  href?: string
  className?: string
}

const variantMap: Record<string, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
}

export function BookCallButton({
  text = 'Book a Call',
  variant = 'primary',
  href = 'https://cal.com/team/advizr/ai-strategy-call',
  className,
}: BookCallButtonProps) {
  const isExternal = /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      className={clsx(styles.bookCallButton, variantMap[variant], className)}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {text}
      <svg
        className={styles.arrow}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M6 3l5 5-5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  )
}
