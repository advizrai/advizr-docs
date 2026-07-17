'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { FigureFrame } from '@/components/ui/figure-frame'

interface VideoEmbedProps {
  url: string
  title?: string
  /** Local videos only: poster image shown before playback. */
  poster?: string
  /**
   * Local videos only. 'tour' (default) = click-to-play facade with poster;
   * 'loop' = muted autoplay loop, gated on prefers-reduced-motion
   * (reduced-motion and no-JS visitors get the poster + native controls).
   */
  mode?: 'tour' | 'loop'
  className?: string
}

type VideoSource =
  | { kind: 'iframe'; embedUrl: string; posterSrc: string | null }
  | { kind: 'local'; src: string }

function getVideoSource(url: string): VideoSource | null {
  // YouTube: youtube.com/watch?v=ID or youtu.be/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  )
  if (ytMatch) {
    return {
      kind: 'iframe',
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`,
      posterSrc: `https://i.ytimg.com/vi/${ytMatch[1]}/hqdefault.jpg`,
    }
  }

  // Loom: loom.com/share/ID
  const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/)
  if (loomMatch) {
    return {
      kind: 'iframe',
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
      posterSrc: null,
    }
  }

  // Self-hosted: a root-relative path into public/videos/
  if (/^\/[^\s]+\.(mp4|webm)$/.test(url)) {
    return { kind: 'local', src: url }
  }

  return null
}

/** Square play control shared by both facades. */
function PlayGlyph() {
  return (
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
  )
}

/**
 * Local tour video: click-to-play. The facade is a plain <img> poster (no
 * video element exists pre-click, so nothing preloads); the click swaps in
 * a native <video controls autoPlay>.
 */
function LocalTour({ src, poster, title }: { src: string; poster?: string; title: string }) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption -- product tour; narration-free screen recording
      <video
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        aria-label={title}
        className="absolute inset-0 size-full"
      />
    )
  }

  return (
    <button
      type="button"
      className={cn(
        'group/facade absolute inset-0 flex size-full cursor-pointer items-center justify-center border-0 bg-transparent p-0',
        'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[hsl(var(--signal))]'
      )}
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
    >
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element -- lite facade; poster only
        <img
          src={poster}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover"
        />
      )}
      <PlayGlyph />
    </button>
  )
}

/**
 * Local loop video: muted autoplay loop, but only under
 * prefers-reduced-motion: no-preference (same gate as the marketing site's
 * VideoMount). Reduced-motion and no-JS visitors get the poster with native
 * controls instead. preload="none" keeps the poster as the LCP.
 */
function LocalLoop({ src, poster, title }: { src: string; poster?: string; title: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [autoplay, setAutoplay] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: no-preference)')
    const apply = () => {
      setAutoplay(mq.matches)
      const el = ref.current
      if (!el) return
      if (mq.matches) {
        el.play().catch(() => {})
      } else {
        el.pause()
      }
    }
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption -- ambient product loop; no dialogue
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      controls={!autoplay}
      aria-label={title}
      className="absolute inset-0 size-full"
    />
  )
}

/**
 * VideoEmbed — FigureFrame'd 16:9 (PR-E): 0-radius hairline frame with
 * corner ticks, mono caption. YouTube/Loom stay click-to-play iframes;
 * root-relative .mp4/.webm paths render a native <video> (mode='tour'
 * click-to-play, mode='loop' gated autoplay).
 */
export function VideoEmbed({
  url,
  title = 'Video',
  poster,
  mode = 'tour',
  className,
}: VideoEmbedProps) {
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
        Unsupported video URL. Use a YouTube or Loom link, or a /videos/*.mp4 path.
      </div>
    )
  }

  return (
    <FigureFrame caption={title} className={cn('my-8', className)}>
      <div className="relative aspect-video w-full bg-[hsl(var(--band))]" data-video-mode={source.kind === 'local' ? mode : 'iframe'}>
        {source.kind === 'local' ? (
          mode === 'loop' ? (
            <LocalLoop src={source.src} poster={poster} title={title} />
          ) : (
            <LocalTour src={source.src} poster={poster} title={title} />
          )
        ) : playing ? (
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
            <PlayGlyph />
          </button>
        )}
      </div>
    </FigureFrame>
  )
}
