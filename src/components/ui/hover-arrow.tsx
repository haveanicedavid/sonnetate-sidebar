import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * When parent has a `group` class, animate an arrow on hover
 */
export function HoverArrow({ className }: { className?: string }) {
  return (
    <ArrowRight
      className={cn(
        className,
        'transform opacity-0 transition-all duration-200 ease-in-out group-hover:translate-x-1 group-hover:opacity-100'
      )}
    />
  )
}
