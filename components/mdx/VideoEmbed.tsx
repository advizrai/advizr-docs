'use client'

import { useState } from 'react'
import clsx from 'clsx'
import styles from './VideoEmbed.module.css'

interface VideoEmbedProps {
  url: string
  title?: string
  className?: string
}

interface VideoSource {
  embedUrl: string
  posterSrc: string | null
}

function getVideoSource(url: string): VideoSource | null {
  // YouTube: youtube.com/watch?v=ID or youtu.be/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  )
  if (ytMatch) {
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`,
      posterSrc: `https://i.ytimg.com/vi/${ytMatch[1]}/hqdefault.jpg`,
    }
  }

  // Loom: loom.com/share/ID
  const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/)
  if (loomMatch) {
    return {
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
      posterSrc: null,
    }
  }

  return null
}

export function VideoEmbed({ url, title = 'Video', className }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false)
  const source = getVideoSource(url)

  if (!source) {
    return (
      <div className={clsx(styles.error, className)}>
        Unsupported video URL. Use a YouTube or Loom link.
      </div>
    )
  }

  return (
    <div className={clsx(styles.videoEmbed, className)}>
      {playing ? (
        <iframe
          src={`${source.embedUrl}?autoplay=1`}
          title={title}
          className={styles.iframe}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className={styles.facade}
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
        >
          {source.posterSrc && (
            // eslint-disable-next-line @next/next/no-img-element -- remote thumbnail host; lite facade avoids next/image config
            <img
              src={source.posterSrc}
              alt={title}
              width={480}
              height={360}
              loading="lazy"
              className={styles.poster}
            />
          )}
          <span className={styles.posterTitle}>{title}</span>
          <span className={styles.playButton} aria-hidden="true">
            <svg
              className={styles.playIcon}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M6.5 4.3a1 1 0 0 1 1.52-.86l8.4 5.7a1 1 0 0 1 0 1.72l-8.4 5.7a1 1 0 0 1-1.52-.86V4.3Z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  )
}
