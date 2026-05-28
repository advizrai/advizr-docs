import clsx from 'clsx'
import styles from './Callout.module.css'

type CalloutType = 'info' | 'warning' | 'danger' | 'tip' | 'note'

interface CalloutProps {
  type?: CalloutType
  title?: string
  children: React.ReactNode
  className?: string
}

const icons: Record<CalloutType, React.ReactNode> = {
  info: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 9v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="6.5" r="1" fill="currentColor" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 2L1 18h18L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="1" fill="currentColor" />
    </svg>
  ),
  danger: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <polygon points="10,1 18.66,5.5 18.66,14.5 10,19 1.34,14.5 1.34,5.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7.5 7.5l5 5M12.5 7.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  tip: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 1a6 6 0 014 10.47V14a1 1 0 01-1 1H7a1 1 0 01-1-1v-2.53A6 6 0 0110 1z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.5 17.5h5M8 15.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  note: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M12.5 2.5l5 5-10 10H2.5v-5l10-10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10.5 4.5l5 5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
}

const variantMap: Record<CalloutType, string> = {
  info: styles.info,
  warning: styles.warning,
  danger: styles.danger,
  tip: styles.tip,
  note: styles.note,
}

export function Callout({ type = 'info', title, children, className }: CalloutProps) {
  return (
    <aside className={clsx(styles.callout, variantMap[type], className)} role="note">
      <div className={styles.header}>
        <span className={styles.icon}>{icons[type]}</span>
        {title && <span className={styles.title}>{title}</span>}
      </div>
      <div className={styles.content}>{children}</div>
    </aside>
  )
}
