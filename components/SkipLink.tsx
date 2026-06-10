import styles from './SkipLink.module.css'

/**
 * Visually hidden until focused — first tab stop on every page.
 * Targets Nextra's main content landmark.
 */
export function SkipLink() {
  return (
    <a href="#nextra-skip-nav" className={styles.skipLink}>
      Skip to content
    </a>
  )
}
