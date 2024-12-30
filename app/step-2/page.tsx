'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ProgressSteps } from '@/components/progress-steps'
import { HelpGuide } from '@/components/help-guide'
import { TeamSection } from '@/components/team-section'
import { SoftwareSelection } from '@/components/software-selection'
import { AIToolsSelection } from '@/components/ai-tools-selection'

type Department = {
  id: string
  name: string
  employees: string
  responsibilities: string
  skillLevel: string
}

export default function Step2Page() {
  const router = useRouter()
  const [departments, setDepartments] = React.useState<Department[]>([])
  const [selectedSoftware, setSelectedSoftware] = React.useState<string[]>([])
  const [selectedAITools, setSelectedAITools] = React.useState<string[]>([])

  const handleNext = () => {
    const teamDetails = {
      departments,
      currentSoftware: selectedSoftware,
      aiToolsOfInterest: selectedAITools,
    }
    localStorage.setItem('teamDetails', JSON.stringify(teamDetails))
    router.push('/step-3')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-40 bg-background">
        <ProgressSteps currentStep={2} />
      </div>
      <div className="flex-1 px-4 lg:px-8 py-6">
        <div className="mr-80">
          <div className="max-w-3xl">
            <div className="mb-12">
              <h1 className="mb-4 text-4xl font-bold tracking-tight">
                Team & Tech Stack
              </h1>
              <p className="text-lg text-muted-foreground">
                Provide details on your team's structure, roles, and current tools. We'll use this to identify skill gaps and guide AI integration.
              </p>
            </div>

            <TeamSection
              departments={departments}
              onDepartmentsChange={setDepartments}
            />

            <SoftwareSelection
              selected={selectedSoftware}
              onSelect={setSelectedSoftware}
            />

            <AIToolsSelection
              selected={selectedAITools}
              onSelect={setSelectedAITools}
            />

            <div className="mt-8 flex justify-end">
              <Button onClick={handleNext}>
                Continue
              </Button>
            </div>
          </div>
        </div>
        <HelpGuide expanded={true} />
      </div>
    </div>
  )
}
