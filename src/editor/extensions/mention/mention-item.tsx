import React, { forwardRef } from 'react'

import { cn } from '@/lib/utils'

interface MentionItemProps extends React.ComponentPropsWithoutRef<'div'> {
  isActive: boolean
}

export const MentionItem = forwardRef<HTMLDivElement, MentionItemProps>(
  ({ isActive, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'cursor-pointer px-3 py-2 text-sm transition-colors duration-100',
          'hover:bg-gray-100 dark:hover:bg-gray-700',
          isActive
            ? 'bg-gray-100 dark:bg-gray-700'
            : 'bg-white dark:bg-gray-800',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

MentionItem.displayName = 'MentionItem'
