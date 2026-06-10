'use client'

import type { CSSProperties } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './NavbarExtra.module.css'

const sections = [
  {
    label: 'Platform',
    href: '/docs/platform',
    accent: 'var(--advizr-blue-500)',
    glow: 'radial-gradient(circle, rgba(10,122,255,0.15) 0%, rgba(10,122,255,0.06) 50%, transparent 100%)',
  },
  {
    label: 'Services',
    href: '/docs/services',
    accent: 'var(--advizr-accent-500)',
    glow: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.06) 50%, transparent 100%)',
  },
  {
    label: 'Academy',
    href: '/docs/academy',
    accent: 'var(--advizr-warning)',
    glow: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.06) 50%, transparent 100%)',
  },
  {
    label: 'Architecture',
    href: '/docs/architecture',
    accent: 'var(--advizr-slate-400)',
    glow: 'radial-gradient(circle, rgba(148,163,184,0.15) 0%, rgba(148,163,184,0.06) 50%, transparent 100%)',
  },
  {
    label: 'Resources',
    href: '/docs/resources',
    accent: 'var(--advizr-blue-500)',
    glow: 'radial-gradient(circle, rgba(10,122,255,0.12) 0%, rgba(10,122,255,0.05) 50%, transparent 100%)',
  },
]

export default function NavbarExtra() {
  const pathname = usePathname()

  return (
    <div className={styles.wrapper}>
      {/* Desktop: inline section links with sliding underline indicator */}
      <nav className={styles.glowNav} aria-label="Main sections">
        <div className={styles.navGlow} aria-hidden="true" />
        <ul className={styles.menuList}>
          {sections.map(({ label, href, accent, glow }) => {
            const isActive = pathname?.startsWith(href)
            return (
              <li
                key={href}
                className={styles.menuItem}
                style={{ '--link-accent': accent } as CSSProperties}
              >
                <span
                  className={styles.itemGlow}
                  style={{ background: glow }}
                  aria-hidden="true"
                />
                <Link
                  href={href}
                  className={clsx(styles.sectionLink, isActive && styles.sectionLinkActive)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      {/* Mobile (<768px): horizontally scrollable pill row below the navbar */}
      <nav className={styles.pillNav} aria-label="Section navigation">
        {sections.map(({ label, href }) => {
          const isActive = pathname?.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={clsx(styles.pill, isActive && styles.pillActive)}
              aria-current={isActive ? 'page' : undefined}
            >
              {label}
            </Link>
          )
        })}
      </nav>
      <a
        href="https://cal.com/team/advizr/ai-strategy-call"
        className={styles.cta}
        target="_blank"
        rel="noopener noreferrer"
      >
        Book a Call
      </a>
    </div>
  )
}
