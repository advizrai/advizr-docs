import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge class names with Tailwind-aware conflict resolution.
 * Standard shadcn-style helper: clsx for conditionals, tailwind-merge
 * so later utilities win over earlier ones in the same group.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
