'use client'

import { useState } from 'react'
import clsx from 'clsx'
import styles from './Details.module.css'

interface DetailsProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}

export function Details({ title, defaultOpen = false, children, className }: DetailsProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <details
      className={clsx(styles.details, className)}
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className={styles.summary}>
        <span className={styles.summaryText}>{title}</span>
        <svg
          className={clsx(styles.chevron, open && styles.chevronOpen)}
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
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  )
}
