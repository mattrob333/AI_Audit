'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { QuestionMarkCircledIcon, Cross2Icon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'

export function HelpPanel({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className={cn("fixed right-4 top-16 z-30", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black border-neutral-800 hover:bg-emerald-500/10 hover:text-emerald-500"
      >
        <QuestionMarkCircledIcon className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="fixed right-0 top-[57px] h-[calc(100vh-57px)] w-80 overflow-y-auto border-l border-neutral-800 bg-black/95 p-6 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-black/80">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-neutral-200">Help & Tips</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 hover:bg-neutral-800/50"
            >
              <Cross2Icon className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
