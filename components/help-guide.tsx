'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface HelpGuideProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  children?: React.ReactNode
}

export function HelpGuide({
  title = "Need Help?",
  description = "Here are some tips to help you answer these questions effectively.",
  children,
  className,
  ...props
}: HelpGuideProps) {
  return (
    <div className={cn("h-full", className)} {...props}>
      <div className="border-b border-neutral-800 px-6 py-4">
        <h2 className="text-lg font-semibold text-neutral-50">{title}</h2>
        <p className="mt-1 text-sm text-neutral-400">
          {description}
        </p>
      </div>
      <div className="p-6 text-sm text-neutral-300 space-y-4">
        {children}
      </div>
    </div>
  )
}
