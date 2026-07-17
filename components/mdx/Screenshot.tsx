import { FigureFrame } from '@/components/ui/figure-frame'
import { cn } from '@/lib/cn'

interface ScreenshotProps {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
  className?: string
}

/**
 * Screenshot — FigureFrame treatment (PR-E, adoption-map §4.3): 0-radius
 * hairline frame with machinist corner ticks, auto "FIG. NN" numbering
 * (FigureProvider is mounted per-page by MdxThemeWrapper), Geist Mono
 * caption below. The mac-chrome traffic lights and the lightbox are gone —
 * the frame links to the full-resolution asset instead (§4.3 "no lightbox").
 */
export function Screenshot({ src, alt, caption, width, height, className }: ScreenshotProps) {
  return (
    <FigureFrame caption={caption} className={cn('my-8', className)}>
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${alt} at full resolution`}
        className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--signal))]"
      >
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
      </a>
    </FigureFrame>
  )
}
