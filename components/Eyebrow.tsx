import clsx from 'clsx'
import styles from './Eyebrow.module.css'

interface EyebrowProps {
  children: React.ReactNode
  className?: string
}

/**
 * Mono uppercase section label — rendered above landing-page H1s.
 * Color follows --section-accent set by the page's data-section wrapper.
 */
export function Eyebrow({ children, className }: EyebrowProps) {
  return <span className={clsx(styles.eyebrow, className)}>{children}</span>
}
