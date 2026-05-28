'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './NavbarExtra.module.css'

const sections = [
  { label: 'Platform', href: '/docs/platform' },
  { label: 'Services', href: '/docs/services' },
  { label: 'Architecture', href: '/docs/architecture' },
  { label: 'Academy', href: '/docs/academy' },
  { label: 'Resources', href: '/docs/resources' },
]

export default function NavbarExtra() {
  const pathname = usePathname()

  return (
    <div className={styles.wrapper}>
      <nav className={styles.sectionLinks} aria-label="Main sections">
        {sections.map(({ label, href }) => {
          const isActive = pathname?.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`${styles.sectionLink} ${isActive ? styles.sectionLinkActive : ''}`}
            >
              {label}
            </Link>
          )
        })}
      </nav>
      <a
        href="https://advizr.ca/book"
        className={styles.cta}
        target="_blank"
        rel="noopener noreferrer"
      >
        Book a Call
      </a>
    </div>
  )
}
