import { isValidElement } from 'react'
import clsx from 'clsx'
import styles from './CodeBlock.module.css'
import { CopyButton } from './CopyButton'

interface CodeBlockProps {
  title?: string
  description?: string
  language?: string
  filename?: string
  /** Explicit text for the copy button; falls back to text derived from children. */
  code?: string
  children: React.ReactNode
  className?: string
}

/** Recursively extract the plain-text content of a React node tree. */
function getNodeText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(getNodeText).join('')
  if (isValidElement(node)) {
    const { children } = node.props as { children?: React.ReactNode }
    return getNodeText(children)
  }
  return ''
}

export function CodeBlock({
  title,
  description,
  language,
  filename,
  code,
  children,
  className,
}: CodeBlockProps) {
  const label = filename || title
  const codeText = code ?? getNodeText(children)

  return (
    <div className={clsx(styles.codeBlock, className)}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {label && <span className={styles.label}>{label}</span>}
          {description && <span className={styles.description}>{description}</span>}
        </div>
        <div className={styles.headerRight}>
          {language && <span className={styles.language}>{language}</span>}
          <CopyButton text={codeText} className={styles.copyBtn} />
        </div>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}
