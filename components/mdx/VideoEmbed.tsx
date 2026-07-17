'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import { FigureFrame } from '@/components/ui/figure-frame'

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

/**
 * VideoEmbed — FigureFrame'd 16:9 (PR-E): 0-radius hairline frame with
 * corner ticks, mono caption, click-to-play facade (no autoplay in article
 * bodies, §4.3). The url/title API is unchanged.
 */
export function VideoEmbed({ url, title = 'Video', className }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false)
  const source = getVideoSource(url)

  if (!source) {
    return (
      <div
        className={cn(
          'my-8 border border-border bg-[hsl(var(--card))] p-4 font-mono text-[0.8125rem] text-[hsl(var(--text-3))]',
          className
        )}
      >
        Unsupported video URL. Use a YouTube or Loom link.
      </div>
    )
  }

  return (
    <FigureFrame caption={title} className={cn('my-8', className)}>
      <div className="relative aspect-video w-full bg-[hsl(var(--band))]">
        {playing ? (
          <iframe
            src={`${source.embedUrl}?autoplay=1`}
            title={title}
            className="absolute inset-0 size-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className={cn(
              'group/facade absolute inset-0 flex size-full cursor-pointer items-center justify-center border-0 bg-transparent p-0',
              'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[hsl(var(--signal))]'
            )}
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
          >
            {source.posterSrc && (
              // eslint-disable-next-line @next/next/no-img-element -- remote thumbnail host; lite facade avoids next/image config
              <img
                src={source.posterSrc}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute inset-0 size-full object-cover"
              />
            )}
            <span
              aria-hidden="true"
              className={cn(
                'relative flex size-12 items-center justify-center rounded-[2px] border border-[hsl(var(--band-hairline))] bg-[hsl(var(--band))/0.85] text-[hsl(var(--paper))]',
                'transition-[background-color] duration-150 ease-out group-hover/facade:bg-[hsl(var(--band))] group-hover/facade:duration-0 motion-reduce:transition-none'
              )}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4.5 2.8v10.4L13 8 4.5 2.8Z" />
              </svg>
            </span>
          </button>
        )}
      </div>
    </FigureFrame>
  )
}
