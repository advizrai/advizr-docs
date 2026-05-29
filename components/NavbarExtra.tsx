'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import styles from './NavbarExtra.module.css'

const sections = [
  {
    label: 'Platform',
    href: '/docs/platform',
    gradient: 'radial-gradient(circle, rgba(10,122,255,0.15) 0%, rgba(10,122,255,0.06) 50%, transparent 100%)',
  },
  {
    label: 'Services',
    href: '/docs/services',
    gradient: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.06) 50%, transparent 100%)',
  },
  {
    label: 'Architecture',
    href: '/docs/architecture',
    gradient: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.06) 50%, transparent 100%)',
  },
  {
    label: 'Academy',
    href: '/docs/academy',
    gradient: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.06) 50%, transparent 100%)',
  },
  {
    label: 'Resources',
    href: '/docs/resources',
    gradient: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(236,72,153,0.06) 50%, transparent 100%)',
  },
]

const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
}

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
}

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
      scale: { duration: 0.5, type: 'spring' as const, stiffness: 300, damping: 25 },
    },
  },
}

const navGlowVariants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  },
}

const sharedTransition = {
  type: 'spring' as const,
  stiffness: 100,
  damping: 20,
  duration: 0.5,
}

export default function NavbarExtra() {
  const pathname = usePathname()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <div className={styles.wrapper}>
      <motion.nav
        className={styles.glowNav}
        initial="initial"
        whileHover="hover"
        aria-label="Main sections"
      >
        <motion.div
          className={`${styles.navGlow} ${isDark ? styles.navGlowDark : styles.navGlowLight}`}
          variants={navGlowVariants}
        />
        <ul className={styles.menuList}>
          {sections.map(({ label, href, gradient }) => {
            const isActive = pathname?.startsWith(href)
            return (
              <motion.li key={href} className={styles.menuItem}>
                <motion.div
                  className={styles.flipContainer}
                  style={{ perspective: '600px' }}
                  whileHover="hover"
                  initial="initial"
                >
                  <motion.div
                    className={styles.itemGlow}
                    variants={glowVariants}
                    style={{ background: gradient, opacity: 0 }}
                  />
                  <motion.div className={styles.flipFront}>
                    <Link
                      href={href}
                      className={`${styles.sectionLink} ${isActive ? styles.sectionLinkActive : ''}`}
                      {...(isActive ? { 'aria-current': 'page' as const } : {})}
                    >
                      {label}
                    </Link>
                  </motion.div>
                  <motion.div
                    className={styles.flipBack}
                    variants={backVariants}
                    transition={sharedTransition}
                    style={{ transformStyle: 'preserve-3d', transformOrigin: 'center top', rotateX: 90 }}
                  >
                    <Link href={href} className={styles.sectionLink} tabIndex={-1}>
                      {label}
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.li>
            )
          })}
        </ul>
      </motion.nav>
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
