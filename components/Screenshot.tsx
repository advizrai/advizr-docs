'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './Screenshot.module.css'

interface ScreenshotProps {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

export function Screenshot({ src, alt, caption, width, height }: ScreenshotProps) {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = original
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  return (
    <>
      <figure className={styles.figure}>
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          className={styles.image}
          onClick={() => setOpen(true)}
        />
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>

      <div
        className={`${styles.overlay} ${open ? styles.overlayVisible : ''}`}
        onClick={close}
        role="dialog"
        aria-modal="true"
        aria-label={alt}
      >
        <button
          className={styles.closeButton}
          onClick={close}
          aria-label="Close"
        >
          &times;
        </button>
        <img
          src={src}
          alt={alt}
          className={styles.overlayImage}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </>
  )
}
