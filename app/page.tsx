'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ProgressSteps } from '@/components/progress-steps'
import { HelpGuide } from '@/components/help-guide'
import { ProjectForm } from '@/components/project-form'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function Page() {
  const router = useRouter()

  const handleNext = () => {
    router.push('/step-2')
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-40 bg-background">
          <ProgressSteps currentStep={1} />
        </div>
        <div className="flex-1 px-4 lg:px-8 py-6 relative">
          <div className="mr-80">
            <ProjectForm onNext={handleNext} />
            <HelpGuide expanded={true} />
          </div>
          <div className="fixed top-[64px] right-0 bottom-0 w-80 border-l bg-background/100 px-4 py-6 z-50">
            <h1 className="text-3xl font-bold mb-4">AI Audit Guide</h1>
            <p className="text-gray-500 mb-8">Best practices for AI projects</p>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="data">
                <AccordionTrigger>Making the Most of Your Data</AccordionTrigger>
                <AccordionContent>
                  Learn how to effectively prepare, clean, and utilize your data for AI projects.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="compliance">
                <AccordionTrigger>Compliance & Security</AccordionTrigger>
                <AccordionContent>
                  Understand the key compliance requirements and security best practices for AI implementations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="process">
                <AccordionTrigger>Process Mapping</AccordionTrigger>
                <AccordionContent>
                  Map out your AI integration process and identify key milestones.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="team">
                <AccordionTrigger>Team Collaboration</AccordionTrigger>
                <AccordionContent>
                  Best practices for team coordination and collaboration in AI projects.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
