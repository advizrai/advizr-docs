import Link from 'next/link'
import clsx from 'clsx'
import { Icon } from './Icon'
import styles from './PathwayCard.module.css'

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
  /** Section slug controlling the accent (platform/services/academy/architecture) */
  section?: string
  className?: string
}

/**
 * Audience-router card for the docs homepage: one card per reader type,
 * each carrying its section accent and three quick links.
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
  return (
    <div data-section={section} className={clsx(styles.pathway, className)}>
      <Link href={href} className={styles.main}>
        <span className={styles.iconBox}>
          <Icon name={icon} size={20} />
        </span>
        <span className={styles.audience}>{audience}</span>
        <span className={styles.title}>
          {title}
          <span className={styles.arrow} aria-hidden>
            &rarr;
          </span>
        </span>
        <span className={styles.description}>{description}</span>
      </Link>
      {links.length > 0 && (
        <ul className={styles.links}>
          {links.slice(0, 3).map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={styles.link}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
