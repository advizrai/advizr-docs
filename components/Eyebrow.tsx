import clsx from 'clsx'

interface EyebrowProps {
  children: React.ReactNode
  className?: string
}

/**
 * Mono uppercase section label — rendered above landing-page H1s.
 * Neutral --text-3 ink (PR-E killed the per-section accent hues; the
 * breadcrumb RefCode carries section wayfinding, --signal stays rationed).
 */
export function Eyebrow({ children, className }: EyebrowProps) {
  return <span className={clsx('eyebrow mb-3 block', className)}>{children}</span>
}
