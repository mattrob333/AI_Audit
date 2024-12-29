'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider } from '@/components/ui/sidebar'
import { MainNav } from '@/components/main-nav'
import { ProgressSteps } from '@/components/progress-steps'
import { DocumentGenerator } from '@/components/document-generator'

export default function Step5Page() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <MainNav />
          <div className="flex-1">
            <ProgressSteps currentStep={5} />
            <DocumentGenerator />
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
