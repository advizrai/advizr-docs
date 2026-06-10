import { iconRegistry } from './icon-registry'

interface IconProps {
  name: string
  size?: 16 | 20 | 24
  className?: string
}

/**
 * Design-system icon: Lucide, fixed stroke 1.5, currentColor, decorative
 * (aria-hidden) — labels always come from accompanying text.
 */
export function Icon({ name, size = 20, className }: IconProps) {
  const LucideIcon = iconRegistry[name]
  if (!LucideIcon) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`[Icon] unknown icon name "${name}" — add it to icon-registry.ts`)
    }
    return null
  }
  return <LucideIcon size={size} strokeWidth={1.5} color="currentColor" aria-hidden className={className} />
}
