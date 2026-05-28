import clsx from 'clsx'
import styles from './CodeBlock.module.css'

interface CodeBlockProps {
  title?: string
  description?: string
  language?: string
  filename?: string
  children: React.ReactNode
  className?: string
}

export function CodeBlock({ title, description, language, filename, children, className }: CodeBlockProps) {
  const label = filename || title

  return (
    <div className={clsx(styles.codeBlock, className)}>
      {(label || language || description) && (
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {label && <span className={styles.label}>{label}</span>}
            {description && <span className={styles.description}>{description}</span>}
          </div>
          {language && <span className={styles.language}>{language}</span>}
        </div>
      )}
      <div className={styles.body}>{children}</div>
    </div>
  )
}
