import * as React from 'react'
import Link from 'next/link'

/**
 * Footer — Instrument Grade site footer (live on every route since PR-D,
 * replacing the legacy footer component). Ships the full link inventory,
 * including the hidden data-status-badge-slot span a live status badge
 * mounts into later.
 *
 * Doctrine: hairline-top opening rule, mono eyebrow column headers,
 * ledger-style 13px link lists (--text-3 idle → --text-1 hover, instant-in /
 * 150ms-out), copyright + legal row under a second hairline. Server
 * component — zero client JS.
 */

type FooterLink = { label: string; href: string; external?: boolean }

const platformLinks: FooterLink[] = [
  { label: 'Overview', href: '/docs/platform' },
  { label: 'Dashboard', href: '/docs/platform/today/dashboard' },
  { label: 'Features', href: '/docs/platform/features' },
  { label: 'FAQ', href: '/docs/platform/faq' },
  { label: 'Onboarding', href: '/docs/platform/onboarding' },
]

const servicesLinks: FooterLink[] = [
  { label: 'How It Works', href: '/docs/services/how-it-works' },
  { label: 'What We Build', href: '/docs/services/what-we-build' },
  { label: 'Pricing', href: '/docs/services/pricing' },
  { label: 'Case Studies', href: '/docs/services/case-studies' },
  { label: 'Guarantees', href: '/docs/services/guarantees' },
]

const academyLinks: FooterLink[] = [
  { label: 'Foundations', href: '/docs/academy/foundations/what-is-ai' },
  { label: 'Prompt Engineering', href: '/docs/academy/prompt-engineering/basics' },
  { label: 'Workflow Mastery', href: '/docs/academy/workflow-mastery/identifying-opportunities' },
  { label: 'Leadership', href: '/docs/academy/leadership/ai-strategy' },
  { label: 'Industry Guides', href: '/docs/academy/industry-guides/construction' },
]

const companyLinks: FooterLink[] = [
  { label: 'advizr.ca', href: 'https://advizr.ca', external: true },
  { label: 'GitHub', href: 'https://github.com/advizrai', external: true },
  { label: 'Contact', href: 'https://advizr.ca/contact', external: true },
]

const linkClass =
  'inline-flex items-center gap-1 text-[0.8125rem] leading-6 text-[hsl(var(--text-3))] transition-[color] duration-150 ease-out hover:duration-0 hover:text-[hsl(var(--text-1))] motion-reduce:transition-none'

function ExternalIcon() {
  return (
    <svg
      className="size-3 opacity-70"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M3.5 3.5h5v5" />
      <path d="M8.5 3.5L3 9" />
    </svg>
  )
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <span className="eyebrow">{title}</span>
      <ul className="mt-3 flex flex-col gap-1.5">
        {links.map(({ label, href, external }) => (
          <li key={href}>
            {external ? (
              <a
                href={href}
                className={linkClass}
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}
                <ExternalIcon />
              </a>
            ) : (
              <Link href={href} className={linkClass}>
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Footer() {
  return (
    <footer
      data-slot="docs-footer"
      className="hairline-t bg-[hsl(var(--background))]"
    >
      <div className="mx-auto w-full max-w-[90rem] px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))]">
          <div>
            <span className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-[hsl(var(--text-1))]">
              Advizr
              <span className="port-dot" aria-hidden="true" />
            </span>
            <p className="mt-3 max-w-[26ch] text-[0.8125rem] leading-relaxed text-[hsl(var(--text-3))]">
              AI transformation for business owners who want results, not buzzwords.
            </p>
          </div>
          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="Services" links={servicesLinks} />
          <FooterColumn title="Academy" links={academyLinks} />
          <FooterColumn title="Company" links={companyLinks} />
        </div>

        <div className="hairline-t mt-12 flex flex-wrap items-center justify-between gap-3 pt-5 text-[0.75rem] text-[hsl(var(--text-3))]">
          <span className="tabular-nums">
            &copy; {new Date().getFullYear()} Advizr AI Inc. All rights reserved.
          </span>
          {/* Empty slot: a live status badge mounts here in a later phase. */}
          <span data-status-badge-slot hidden />
          <div className="flex items-center gap-5">
            <Link href="/docs/legal/terms-of-service" className={linkClass}>
              Terms
            </Link>
            <Link href="/docs/legal/privacy-policy" className={linkClass}>
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
export default Footer
