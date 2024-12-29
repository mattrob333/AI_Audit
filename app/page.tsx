'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ProgressSteps } from '@/components/progress-steps'
import { HelpGuide } from '@/components/help-guide'
import { ProjectForm } from '@/components/project-form'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function Page() {
  const router = useRouter()

  const handleNext = () => {
    router.push('/step-2')
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex flex-col min-h-screen">
          <div className="sticky top-0 z-40 bg-background">
            <ProgressSteps currentStep={1} />
          </div>
          <div className="flex-1 px-4 lg:px-8 py-6">
            <div className="mr-80">
              <ProjectForm onNext={handleNext} />
            </div>
            <HelpGuide expanded={true} />
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
