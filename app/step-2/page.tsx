'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ProgressSteps } from '@/components/progress-steps'
import { TeamProfiles } from '@/components/team-profiles'
import { SoftwareSelection } from '@/components/software-selection'
import { AIToolsSelection } from '@/components/ai-tools-selection'

interface TeamMember {
  id: string;
  name: string;
  role: string;
  responsibilities: string;
  email: string;
  inviteStatus: 'not_invited' | 'invited' | 'completed';
  details?: {
    department?: string;
    reportsTo?: string;
    enneagramType?: string;
  }
}

export default function Step2Page() {
  const router = useRouter()
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([])
  const [selectedSoftware, setSelectedSoftware] = React.useState<string[]>([])
  const [selectedAITools, setSelectedAITools] = React.useState<string[]>([])

  const handleNext = () => {
    const teamDetails = {
      teamMembers,
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
        <div className="mr-40">
          <div className="max-w-[1200px]">
            <div className="mb-12">
              <h1 className="mb-4 text-4xl font-bold tracking-tight">
                Team & Tech Stack
              </h1>
              <p className="text-lg text-muted-foreground">
                Provide details on your team's structure, roles, and current tools. We'll use this to identify skill gaps and guide AI integration.
              </p>
            </div>

            <TeamProfiles
              teamMembers={teamMembers}
              onTeamMembersChange={setTeamMembers}
            />

            <div className="mt-12">
              <SoftwareSelection
                selected={selectedSoftware}
                onSelect={setSelectedSoftware}
              />
            </div>

            <div className="mt-12">
              <AIToolsSelection
                selected={selectedAITools}
                onSelect={setSelectedAITools}
              />
            </div>

            <div className="mt-12 flex justify-end">
              <Button onClick={handleNext}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
