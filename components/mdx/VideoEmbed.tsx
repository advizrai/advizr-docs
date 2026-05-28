import clsx from 'clsx'
import styles from './VideoEmbed.module.css'

interface VideoEmbedProps {
  url: string
  title?: string
  className?: string
}

function getEmbedUrl(url: string): string | null {
  // YouTube: youtube.com/watch?v=ID or youtu.be/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  )
  if (ytMatch) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`
  }

  // Loom: loom.com/share/ID
  const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/)
  if (loomMatch) {
    return `https://www.loom.com/embed/${loomMatch[1]}`
  }

  return null
}

export function VideoEmbed({ url, title = 'Video', className }: VideoEmbedProps) {
  const embedUrl = getEmbedUrl(url)

  if (!embedUrl) {
    return (
      <div className={clsx(styles.error, className)}>
        Unsupported video URL. Use a YouTube or Loom link.
      </div>
    )
  }

  return (
    <div className={clsx(styles.videoEmbed, className)}>
      <iframe
        src={embedUrl}
        title={title}
        className={styles.iframe}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
