'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider } from '@/components/ui/sidebar'
import { MainNav } from '@/components/main-nav'
import { ProgressSteps } from '@/components/progress-steps'
import { HelpGuide } from '@/components/help-guide'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CollapsibleSection } from '@/components/ui/collapsible-section'
import { Pencil, ChevronDown, ChevronUp } from 'lucide-react'

export default function Step4Page() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [overview, setOverview] = React.useState<any>(null)
  const [expandedSections, setExpandedSections] = React.useState<string[]>([])
  const [hasChanges, setHasChanges] = React.useState(false)

  const generateOverview = async () => {
    try {
      setLoading(true)
      setError('')
      
      const businessDetails = JSON.parse(localStorage.getItem('businessDetails') || '{}')
      const teamDetails = JSON.parse(localStorage.getItem('teamDetails') || '{}')
      const auditAnswers = JSON.parse(localStorage.getItem('auditAnswers') || '[]')

      if (!businessDetails.businessName || !teamDetails || !auditAnswers.length) {
        setError('Please complete all previous steps first')
        return
      }

      const response = await fetch('/api/generate-overview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessDetails, teamDetails, auditAnswers }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to generate overview (${response.status})`)
      }

      const data = await response.json()
      setOverview(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate overview')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    generateOverview()
  }, [])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleSaveSection = async (sectionId: string, content: any) => {
    setOverview((prev: Record<string, any>) => ({
      ...prev,
      [sectionId]: content
    }))
    setHasChanges(true)

    // Save to localStorage to persist changes
    const updatedOverview = {
      ...overview,
      [sectionId]: content
    }
    localStorage.setItem('aiPlanOverview', JSON.stringify(updatedOverview))
  }

  const handleContinue = async () => {
    try {
      // Save final state before proceeding
      if (hasChanges) {
        const response = await fetch('/api/save-overview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ overview }),
        })

        if (!response.ok) {
          throw new Error('Failed to save changes')
        }
      }

      router.push('/step-5')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes')
    }
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <MainNav />
          <div className="flex-1">
            <ProgressSteps currentStep={4} />
            <div className="px-4 lg:px-8">
              <main className="mr-80">
                <div className="max-w-4xl py-8">
                  <h1 className="text-4xl font-bold tracking-tight mb-2">
                    AI Integration Plan Overview
                  </h1>
                  <p className="text-muted-foreground mb-8">
                    Review and refine your AI integration plan before finalizing. You can edit any details or add missing information.
                  </p>

                  {error && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertDescription className="flex items-center justify-between">
                        <span>{error}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={generateOverview}
                          disabled={loading}
                        >
                          Try Again
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}

                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <LoadingSpinner />
                      <p className="mt-4 text-lg text-muted-foreground">
                        Analyzing your business and generating AI integration plan...
                      </p>
                    </div>
                  ) : overview && (
                    <div className="space-y-6">
                      <CollapsibleSection
                        title="Business Overview"
                        content={overview.businessOverview}
                        sectionId="businessOverview"
                        isExpanded={expandedSections.includes('businessOverview')}
                        onToggle={toggleSection}
                        onSave={handleSaveSection}
                      />
                      <CollapsibleSection
                        title="Key Challenges"
                        content={overview.keyChallenges}
                        sectionId="keyChallenges"
                        isExpanded={expandedSections.includes('keyChallenges')}
                        onToggle={toggleSection}
                        onSave={handleSaveSection}
                      />
                      <CollapsibleSection
                        title="Strengths"
                        content={overview.strengths}
                        sectionId="strengths"
                        isExpanded={expandedSections.includes('strengths')}
                        onToggle={toggleSection}
                        onSave={handleSaveSection}
                      />
                      <CollapsibleSection
                        title="Integration Opportunities"
                        content={overview.integrationOpportunities}
                        sectionId="integrationOpportunities"
                        isExpanded={expandedSections.includes('integrationOpportunities')}
                        onToggle={toggleSection}
                        onSave={handleSaveSection}
                      />
                      <CollapsibleSection
                        title="Implementation Considerations"
                        content={overview.implementationConsiderations}
                        sectionId="implementationConsiderations"
                        isExpanded={expandedSections.includes('implementationConsiderations')}
                        onToggle={toggleSection}
                        onSave={handleSaveSection}
                      />
                      <CollapsibleSection
                        title="Timeline"
                        content={overview.timeline}
                        sectionId="timeline"
                        isExpanded={expandedSections.includes('timeline')}
                        onToggle={toggleSection}
                        onSave={handleSaveSection}
                      />
                      <CollapsibleSection
                        title="Training Needs"
                        content={overview.trainingNeeds}
                        sectionId="trainingNeeds"
                        isExpanded={expandedSections.includes('trainingNeeds')}
                        onToggle={toggleSection}
                        onSave={handleSaveSection}
                      />
                      <CollapsibleSection
                        title="Compliance & Security"
                        content={overview.complianceAndSecurity}
                        sectionId="complianceAndSecurity"
                        isExpanded={expandedSections.includes('complianceAndSecurity')}
                        onToggle={toggleSection}
                        onSave={handleSaveSection}
                      />
                      
                      <div className="flex justify-end space-x-4 mt-8">
                        <Button variant="outline" onClick={() => router.push('/step-3')}>
                          Previous Step
                        </Button>
                        <Button 
                          onClick={handleContinue}
                          disabled={loading}
                        >
                          {hasChanges ? 'Save & Continue' : 'Continue'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </main>
              <HelpGuide expanded={true} />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
