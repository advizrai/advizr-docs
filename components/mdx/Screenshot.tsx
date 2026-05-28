'use client'

import { useState, useEffect, useCallback } from 'react'
import clsx from 'clsx'
import styles from './Screenshot.module.css'

interface ScreenshotProps {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
  className?: string
}

export function Screenshot({ src, alt, caption, width, height, className }: ScreenshotProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const close = useCallback(() => setLightboxOpen(false), [])

  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightboxOpen, close])

  return (
    <>
      <figure className={clsx(styles.figure, className)}>
        <div
          className={styles.imageWrapper}
          onClick={() => setLightboxOpen(true)}
          role="button"
          tabIndex={0}
          aria-label={`View ${alt} full size`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setLightboxOpen(true)
            }
          }}
        >
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={styles.image}
            loading="lazy"
          />
        </div>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>

      {lightboxOpen && (
        <div className={styles.lightbox} onClick={close} role="dialog" aria-label={alt}>
          <img
            src={src}
            alt={alt}
            className={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
