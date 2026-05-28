import Link from 'next/link'
import styles from './CustomFooter.module.css'

const platformLinks = [
  { label: 'Overview', href: '/docs/platform' },
  { label: 'Dashboard', href: '/docs/platform/dashboard/home' },
  { label: 'Features', href: '/docs/platform/features' },
  { label: 'FAQ', href: '/docs/platform/faq' },
  { label: 'Onboarding', href: '/docs/platform/onboarding' },
]

const servicesLinks = [
  { label: 'How It Works', href: '/docs/services/how-it-works' },
  { label: 'What We Build', href: '/docs/services/what-we-build' },
  { label: 'Pricing', href: '/docs/services/pricing' },
  { label: 'Case Studies', href: '/docs/services/case-studies' },
  { label: 'Guarantees', href: '/docs/services/guarantees' },
]

const academyLinks = [
  { label: 'Foundations', href: '/docs/academy/foundations/what-is-ai' },
  { label: 'Prompt Engineering', href: '/docs/academy/prompt-engineering/basics' },
  { label: 'Workflow Mastery', href: '/docs/academy/workflow-mastery/identifying-opportunities' },
  { label: 'Leadership', href: '/docs/academy/leadership/ai-strategy' },
  { label: 'Industry Guides', href: '/docs/academy/industry-guides/construction' },
]

const companyLinks: Array<{ label: string; href: string; external?: boolean }> = [
  { label: 'advizr.ca', href: 'https://advizr.ca', external: true },
  { label: 'GitHub', href: 'https://github.com/advizrai', external: true },
  { label: 'Contact', href: 'https://advizr.ca/contact', external: true },
]

function ExternalIcon() {
  return (
    <svg
      className={styles.externalIcon}
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

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: Array<{ label: string; href: string; external?: boolean }>
}) {
  return (
    <div>
      <span className={styles.columnTitle}>{title}</span>
      <ul className={styles.columnLinks}>
        {links.map(({ label, href, external }) => (
          <li key={href}>
            {external ? (
              <a
                href={href}
                className={styles.columnLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {label}
                <ExternalIcon />
              </a>
            ) : (
              <Link href={href} className={styles.columnLink}>
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function CustomFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div>
            <span className={styles.brandName}>
              Advizr
              <span className={styles.statusDot} aria-hidden="true" />
            </span>
            <p className={styles.tagline}>
              AI transformation for business owners who want results, not buzzwords.
            </p>
          </div>
          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="Services" links={servicesLinks} />
          <FooterColumn title="Academy" links={academyLinks} />
          <FooterColumn title="Company" links={companyLinks} />
        </div>
        <div className={styles.bottom}>
          <span>&copy; {new Date().getFullYear()} Advizr AI Inc. All rights reserved.</span>
          <div className={styles.legalLinks}>
            <Link href="/docs/legal/terms-of-service">Terms</Link>
            <Link href="/docs/legal/privacy-policy">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
