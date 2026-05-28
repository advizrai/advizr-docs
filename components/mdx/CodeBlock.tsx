'use client'

import { useRef, useState, useEffect } from 'react'
import clsx from 'clsx'
import styles from './CodeBlock.module.css'
import { CopyButton } from './CopyButton'

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
  const bodyRef = useRef<HTMLDivElement>(null)
  const [codeText, setCodeText] = useState('')

  useEffect(() => {
    const pre = bodyRef.current?.querySelector('pre')
    if (pre) {
      setCodeText(pre.textContent ?? '')
    }
  }, [children])

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
      <div className={styles.body} ref={bodyRef}>{children}</div>
    </div>
  )
}
