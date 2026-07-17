import Link from 'next/link'
import clsx from 'clsx'

import { Icon } from './Icon'
import { SECTION_REF_CODES } from '@/lib/docs-nav'

interface PathwayLink {
  label: string
  href: string
}

interface PathwayCardProps {
  /** Audience framing, e.g. "I'm a client" — rendered as a mono eyebrow */
  audience: string
  title: string
  description: string
  href: string
  icon: string
  /** Up to three popular destinations inside this pathway */
  links?: PathwayLink[]
  /** Section slug (platform/services/academy/architecture) — sets data-section and the RefCode prefix */
  section?: string
  className?: string
}

/**
 * Audience-router card for the docs homepage (PR-E): hairline frame,
 * 0 radius, icon in a 1px hairline square, neutral mono audience eyebrow
 * prefixed by the section RefCode (PLT/SVC/ACD/ARC). The per-section accent
 * hues are dead — RefCodes carry the wayfinding, --signal stays rationed.
 * data-section survives for RefCode/OG plumbing.
 */
export function PathwayCard({
  audience,
  title,
  description,
  href,
  icon,
  links = [],
  section,
  className,
}: PathwayCardProps) {
  const refCode = section ? SECTION_REF_CODES[section] : undefined

  return (
    <div
      data-section={section}
      className={clsx(
        'flex flex-col border border-border bg-[hsl(var(--card))]',
        className
      )}
    >
      <Link
        href={href}
        className={clsx(
          'flex flex-1 flex-col p-5 text-inherit no-underline',
          'transition-[background-color] duration-150 ease-out hover:bg-[hsl(var(--secondary))] hover:duration-0 motion-reduce:transition-none',
          'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[hsl(var(--signal))]'
        )}
      >
        <span
          className="mb-4 inline-flex size-10 items-center justify-center border border-border text-[hsl(var(--text-2))]"
          aria-hidden="true"
        >
          <Icon name={icon} size={16} />
        </span>
        <span className="mb-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-[hsl(var(--text-3))]">
          {refCode ? `${refCode} — ${audience}` : audience}
        </span>
        <span className="mb-1.5 flex items-center gap-1.5 text-[0.9375rem] font-medium text-[hsl(var(--text-1))]">
          {title}
          <span className="text-[0.8125rem] text-[hsl(var(--text-3))]" aria-hidden>
            &rarr;
          </span>
        </span>
        <span className="text-[0.8125rem] leading-relaxed text-[hsl(var(--text-3))]">
          {description}
        </span>
      </Link>
      {links.length > 0 && (
        <ul className="hairline-t m-0 flex list-none flex-col gap-0.5 px-5 pb-4 pt-3">
          {links.slice(0, 3).map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="inline-block py-0.5 text-[0.8125rem] text-[hsl(var(--text-3))] no-underline transition-[color] duration-150 ease-out hover:text-[hsl(var(--text-1))] hover:duration-0 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[hsl(var(--signal))]"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
