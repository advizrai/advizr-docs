import clsx from 'clsx'

interface SectionProps {
  title?: string
  description?: string
  id?: string
  variant?: 'default' | 'muted' | 'highlight' | 'cta'
  /** Scroll-reveal entrance (marketing surfaces only — never article prose) */
  reveal?: boolean
  children: React.ReactNode
  className?: string
}

/**
 * Section — landing-page band (PR-D): hierarchy via hairlines + surface
 * swaps, centered 600-weight title, no gradients. `muted`/`highlight` sit on
 * the first surface step between hairlines; `cta` is the same treatment for
 * the closing block.
 */

const variantMap: Record<string, string | undefined> = {
  default: undefined,
  muted: 'hairline-t hairline-b bg-[hsl(var(--surface-1))]',
  highlight: 'hairline-t hairline-b bg-[hsl(var(--surface-1))]',
  cta: 'hairline-t hairline-b bg-[hsl(var(--surface-1))] text-center',
}

export function Section({
  title,
  description,
  id,
  variant = 'default',
  reveal = false,
  children,
  className,
}: SectionProps) {
  return (
    <section
      className={clsx('px-6 py-16 md:py-20', variantMap[variant], className)}
      id={id}
    >
      <div
        className="mx-auto max-w-6xl"
        {...(reveal ? { 'data-reveal': '' } : {})}
      >
        {title && (
          <h2 className="m-0 text-center text-[1.375rem] font-semibold tracking-[-0.02em] text-[hsl(var(--text-1))]">
            {title}
          </h2>
        )}
        {description && (
          <p className="mx-auto mb-10 mt-3 max-w-[56ch] text-center text-[0.9375rem] leading-relaxed text-[hsl(var(--text-3))]">
            {description}
          </p>
        )}
        {!description && title && <div className="mb-10" />}
        {children}
      </div>
    </section>
  )
}
