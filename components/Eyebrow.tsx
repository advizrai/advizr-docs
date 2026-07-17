import clsx from 'clsx'

interface EyebrowProps {
  children: React.ReactNode
  className?: string
}

/**
 * Mono uppercase section label — rendered above landing-page H1s.
 * Color follows --section-accent set by the page's data-section wrapper.
 */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={clsx(
        'eyebrow mb-3 block text-[color:var(--section-accent,hsl(var(--muted-foreground)))]',
        className
      )}
    >
      {children}
    </span>
  )
}
