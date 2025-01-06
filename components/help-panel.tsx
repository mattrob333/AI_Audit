'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { QuestionMarkCircledIcon, Cross2Icon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'

export function HelpPanel({ className }: { className?: string }) {
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
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-emerald-500">AI Audit Guide</h4>
              <h5 className="text-sm font-medium text-neutral-300">Why This Step Is Important:</h5>
              <ul className="text-sm text-neutral-400 space-y-2">
                <li className="flex gap-2">
                  <span>→</span>
                  <span>Context is Key: By understanding your business situation, we can tailor AI solutions to your specific needs.</span>
                </li>
                <li className="flex gap-2">
                  <span>→</span>
                  <span>Saves You Time: You only need to enter your URL or speak your thoughts, and we'll do the heavy lifting.</span>
                </li>
                <li className="flex gap-2">
                  <span>→</span>
                  <span>Personalized Roadmap: The more we know about your situation, the better our recommendations.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-emerald-500">Available Tools</h4>
              <ul className="text-sm text-neutral-400 space-y-2">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>AI Business Analyzer</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Voice Input Recognition</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Smart Recommendations Engine</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-emerald-500">What Happens Next</h4>
              <p className="text-sm text-neutral-400">
                After this step, we'll analyze your tech stack and team structure to identify the best AI integration points for your organization.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
