'use client'

import { useId, useState } from 'react'
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
  const id = useId()
  const triggerId = `${id}-trigger`
  const contentId = `${id}-content`

  return (
    <div
      className={clsx(styles.details, className)}
      data-open={open ? '' : undefined}
    >
      <button
        type="button"
        id={triggerId}
        className={styles.summary}
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={styles.summaryText}>{title}</span>
        <svg
          className={styles.chevron}
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
      </button>
      <div
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        className={styles.collapse}
      >
        <div className={styles.collapseInner}>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  )
}
