'use client'

import { Sidebar } from '@/components/sidebar'
import { ProgressSteps } from '@/components/progress-steps'
import { HelpPanel } from '@/components/help-panel'

export default function TeamPage() {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar className="fixed left-0 top-0 h-full w-64" />
      
      <main className="flex-1 pl-64">
        <div className="sticky top-0 z-40 border-b border-neutral-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
          <ProgressSteps currentStep={2} />
        </div>
        
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-50">
              Team & Software Analysis
            </h1>
            <p className="mt-3 text-lg text-neutral-400 leading-relaxed">
              Let's understand your team structure and current software stack to identify the best AI integration points.
            </p>
          </div>

          {/* Team form will go here */}
          <div className="text-neutral-400">Team form coming soon...</div>
        </div>
      </main>

      <HelpPanel />
    </div>
  )
}
