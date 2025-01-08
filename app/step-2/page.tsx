'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ProgressSteps } from '@/components/progress-steps'
import { TeamMemberSection } from '@/components/team-member-section'
import { SoftwareSelection } from '@/components/software-selection'
import { AIToolsSelection } from '@/components/ai-tools-selection'
import { Sidebar } from '@/components/sidebar'
import { HelpPanel } from '@/components/help-panel'
import { ArrowRight } from 'lucide-react'
import { TeamMember, TeamDetails } from '@/lib/types'

export default function Step2Page() {
  const router = useRouter()
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>([])
  const [selectedSoftware, setSelectedSoftware] = React.useState<string[]>([])
  const [selectedAITools, setSelectedAITools] = React.useState<string[]>([])

  const handleNext = () => {
    const teamDetails: TeamDetails = {
      teamMembers,
      teamSize: teamMembers.length,
      currentSoftware: selectedSoftware,
      aiToolsOfInterest: selectedAITools,
    }
    localStorage.setItem('teamDetails', JSON.stringify(teamDetails))
    router.push('/step-3')
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar className="fixed left-0 top-0 h-full w-64" />
      
      <main className="flex-1 pl-64">
        <div className="sticky top-0 z-40 border-b border-neutral-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
          <ProgressSteps currentStep={2} />
        </div>
        
        <div className="px-8 py-12 min-h-[calc(100vh-4rem)]">
          <div className="max-w-[90rem] mx-auto">
            <div className="space-y-6 mb-12">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-neutral-50">
                  Meet Your Team & Explore Your Tech Stack
                </h1>
                <p className="text-lg text-neutral-400">
                  Identify your team members' roles, responsibilities, and the tools they currently use.
                </p>
              </div>

              <div className="space-y-4 p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                <div className="space-y-2">
                  <h2 className="font-medium text-neutral-300">What We'll Need:</h2>
                  <ul className="list-disc list-inside space-y-1 text-neutral-400">
                    <li>A list of your team members (names, emails, roles)</li>
                    <li>Quick details on their daily tasks and communication preferences</li>
                    <li>Current software, platforms, or AI tools (e.g., Slack, Salesforce, Midjourney)</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h2 className="font-medium text-neutral-300">Why It Matters:</h2>
                  <ul className="list-disc list-inside space-y-1 text-neutral-400">
                    <li>This helps us spot skill gaps and integration possibilities.</li>
                    <li>When each team member contributes their info, we can tailor AI solutions more precisely.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-neutral-900/50 rounded-xl border border-neutral-800/50 backdrop-blur-sm">
                <div className="p-8">
                  <TeamMemberSection
                    teamMembers={teamMembers}
                    onChange={setTeamMembers}
                  />
                </div>
              </div>

              <div className="bg-neutral-900/50 rounded-xl border border-neutral-800/50 backdrop-blur-sm">
                <div className="p-8">
                  <SoftwareSelection
                    selected={selectedSoftware}
                    onSelect={setSelectedSoftware}
                  />
                </div>
              </div>

              <div className="bg-neutral-900/50 rounded-xl border border-neutral-800/50 backdrop-blur-sm">
                <div className="p-8">
                  <AIToolsSelection
                    selected={selectedAITools}
                    onSelect={setSelectedAITools}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleNext}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
                >
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <HelpPanel className="fixed right-0 top-0 h-full w-64">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Help & Tips</h3>
          <p className="text-sm text-neutral-400">
            Need assistance? This panel provides helpful tips and guidance for the current step.
          </p>
        </div>
      </HelpPanel>
    </div>
  )
}
