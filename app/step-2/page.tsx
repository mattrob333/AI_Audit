'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ProgressSteps } from '@/components/progress-steps'
import { TeamProfiles } from '@/components/team-profiles'
import { SoftwareSelection } from '@/components/software-selection'
import { AIToolsSelection } from '@/components/ai-tools-selection'
import { Sidebar } from '@/components/sidebar'
import { HelpPanel } from '@/components/help-panel'

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
    enneagramType?: {
      value: string;
      label: string;
    };
    aiSkills?: string[];
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
    <div className="flex min-h-screen bg-black">
      <Sidebar className="fixed left-0 top-0 h-full w-52" />
      
      <main className="flex-1 pl-52">
        <div className="sticky top-0 z-40 border-b border-neutral-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
          <ProgressSteps currentStep={2} />
        </div>
        
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-50">
              Team & Tech Stack
            </h1>
            <p className="mt-3 text-lg text-neutral-400 leading-relaxed">
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
            <Button 
              onClick={handleNext}
              size="lg" 
              className="bg-emerald-500 hover:bg-emerald-600 text-neutral-900"
            >
              Continue
            </Button>
          </div>
        </div>
      </main>

      <HelpPanel />
    </div>
  )
}
