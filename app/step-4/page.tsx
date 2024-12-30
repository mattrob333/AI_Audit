'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ProgressSteps } from '@/components/progress-steps'
import { HelpGuide } from '@/components/help-guide'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CollapsibleSection } from '@/components/ui/collapsible-section'
import { Pencil, ChevronDown, ChevronUp } from 'lucide-react'

interface Timeline {
  [phase: string]: string;
}

interface OverviewData {
  timeline?: Timeline;
  [key: string]: Timeline | string[] | string | undefined;
}

export default function Step4Page() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [overview, setOverview] = React.useState<OverviewData | null>(null)
  const [expandedSections, setExpandedSections] = React.useState<string[]>([])
  const [hasChanges, setHasChanges] = React.useState(false)

  const formatTitle = (title: string) => {
    return title
      .split(/(?=[A-Z])|_/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  const renderTimeline = (timeline: Timeline) => {
    return (
      <div className="space-y-4">
        {Object.entries(timeline).map(([phase, description]: [string, string]) => (
          <div key={phase} className="space-y-2">
            <h3 className="font-semibold">{formatTitle(phase)}</h3>
            <p>{String(description)}</p>
          </div>
        ))}
      </div>
    )
  }

  const validateOverviewData = (data: any): data is OverviewData => {
    if (typeof data !== 'object' || data === null) return false;
    
    if (data.timeline) {
      if (typeof data.timeline !== 'object') return false;
      for (const [_, value] of Object.entries(data.timeline)) {
        if (typeof value !== 'string') return false;
      }
    }
    
    return true;
  }

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
      
      if (!validateOverviewData(data)) {
        throw new Error('Invalid overview data structure received from API')
      }
      
      setOverview(data)
    } catch (err: any) {
      setError(err.message || 'Failed to generate overview')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    generateOverview()
  }, [])

  const handleNext = () => {
    router.push('/step-5')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-40 bg-background">
        <ProgressSteps currentStep={4} />
      </div>
      <div className="flex-1 px-4 lg:px-8 py-6">
        <div className="mr-80">
          <div className="max-w-3xl">
            <div className="mb-12">
              <h1 className="mb-4 text-4xl font-bold tracking-tight">
                Integration Overview
              </h1>
              <p className="text-lg text-muted-foreground">
                Review your personalized AI integration plan based on your responses.
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : overview ? (
              <>
                {Object.entries(overview).map(([section, content]) => {
                  const formattedTitle = formatTitle(section)
                  
                  return (
                    <CollapsibleSection
                      key={section}
                      title={formattedTitle}
                      defaultExpanded={true}
                    >
                      <div className="prose prose-invert max-w-none">
                        {section === 'timeline' && content && typeof content === 'object' ? (
                          renderTimeline(content as Timeline)
                        ) : typeof content === 'string' ? (
                          <div dangerouslySetInnerHTML={{ __html: content }} />
                        ) : Array.isArray(content) ? (
                          <ul className="list-disc pl-6 space-y-2">
                            {content.map((item, index) => (
                              <li key={index}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
                            ))}
                          </ul>
                        ) : (
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(content, null, 2)}
                          </pre>
                        )}
                      </div>
                    </CollapsibleSection>
                  )
                })}
                
                <div className="mt-8 flex justify-end">
                  <Button onClick={handleNext}>
                    Continue to Documents
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </div>
        <HelpGuide expanded={true} />
      </div>
    </div>
  )
}
