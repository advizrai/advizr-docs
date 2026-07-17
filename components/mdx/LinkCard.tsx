import Link from 'next/link'
import { cn } from '@/lib/cn'
import { Icon } from '../Icon'

interface LinkCardProps {
  title: string
  description?: string
  href: string
  /** Registry icon name (icon-registry.ts), e.g. "clipboard-list". */
  icon?: string
  /** Optional mono eyebrow above the title. External links default to their host. */
  eyebrow?: string
  className?: string
}

const isExternal = (href: string) => href.startsWith('http')

function hostOf(href: string): string | undefined {
  try {
    return new URL(href).host.replace(/^www\./, '')
  } catch {
    return undefined
  }
}

/**
 * LinkCard — hairline card, 0 radius (PR-E): registry icon in a hairline
 * square, mono eyebrow, 500-weight title, --text-3 description, mono arrow
 * affordance. Hover is a surface step, instant-in / 150ms-out.
 *
 * Bug fix (pre-existing): `icon` is a registry NAME ("clipboard-list") but
 * was interpolated as text — every card rendered the literal string. It now
 * resolves through components/Icon (the icon-registry lookup), matching how
 * Card/Feature/IconBox consume the same prop.
 */
export function LinkCard({ title, description, href, icon, eyebrow, className }: LinkCardProps) {
  const external = isExternal(href)
  const Component = external ? 'a' : Link
  const externalProps = external ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {}
  const eyebrowText = eyebrow ?? (external ? hostOf(href) : undefined)

  return (
    <Component
      href={href}
      className={cn(
        'group/linkcard my-4 flex items-start gap-3.5 border border-border bg-[hsl(var(--card))] p-4 text-inherit no-underline',
        'transition-[background-color] duration-150 ease-out hover:bg-[hsl(var(--secondary))] hover:duration-0 motion-reduce:transition-none',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--signal))]',
        className
      )}
      {...externalProps}
    >
      {icon && (
        <span
          className="flex size-8 shrink-0 items-center justify-center border border-border text-[hsl(var(--text-2))]"
          aria-hidden="true"
        >
          <Icon name={icon} size={16} />
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        {eyebrowText && (
          <span className="mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[hsl(var(--text-3))]">
            {eyebrowText}
          </span>
        )}
        <span className="text-[0.875rem] font-medium leading-snug text-[hsl(var(--text-1))]">
          {title}
        </span>
        {description && (
          <span className="mt-1 text-[0.8125rem] leading-relaxed text-[hsl(var(--text-3))]">
            {description}
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'shrink-0 self-center font-mono text-[0.8125rem] leading-none text-[hsl(var(--text-4))]',
          'transition-[color] duration-150 ease-out group-hover/linkcard:text-[hsl(var(--text-1))] group-hover/linkcard:duration-0 motion-reduce:transition-none'
        )}
      >
        →
      </span>
    </Component>
  )
}
