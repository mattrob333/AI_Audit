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
import { Sidebar } from '@/components/sidebar'

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

  const renderTimelineContent = (timeline: Timeline) => {
    return Object.entries(timeline).map(([phase, description]) => (
      <div key={phase} className="space-y-2">
        <h3 className="font-semibold">{formatTitle(phase)}</h3>
        <p>{description}</p>
      </div>
    ))
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
    <div className="flex min-h-screen bg-black">
      {/* Left Navigation Sidebar */}
      <Sidebar className="fixed left-0 top-0 h-full w-64" />
      
      {/* Main Content */}
      <div className="flex flex-1 flex-col pl-64">
        {/* Top Progress Bar */}
        <div className="sticky top-0 z-40 border-b border-neutral-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
          <ProgressSteps currentStep={4} />
        </div>

        {/* Main Content Area */}
        <div className="relative flex min-h-[calc(100vh-3.5rem)]">
          <div className="flex-1">
            <div className="mx-auto max-w-4xl px-8 py-10">
              <div className="mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-neutral-50">
                  Integration Overview
                </h1>
                <p className="mt-3 text-lg text-neutral-400 leading-relaxed">
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
                <div className="space-y-6">
                  {Object.entries(overview).map(([section, content]) => {
                    const formattedTitle = formatTitle(section)
                    
                    let renderedContent: React.ReactNode = null;
                    if (section === 'timeline' && content && typeof content === 'object') {
                      renderedContent = renderTimelineContent(content as Timeline);
                    } else if (typeof content === 'string') {
                      renderedContent = <div className="text-neutral-300" dangerouslySetInnerHTML={{ __html: content }} />;
                    } else if (Array.isArray(content)) {
                      renderedContent = (
                        <ul className="space-y-2 text-neutral-300">
                          {content.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mr-2 mt-1.5 text-neutral-300">•</span>
                              <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    } else {
                      renderedContent = (
                        <pre className="whitespace-pre-wrap text-neutral-300">
                          {JSON.stringify(content, null, 2)}
                        </pre>
                      );
                    }
                    
                    return (
                      <CollapsibleSection
                        key={section}
                        title={formattedTitle}
                        defaultExpanded={true}
                      >
                        <div className="space-y-4 text-neutral-300">
                          {renderedContent}
                        </div>
                      </CollapsibleSection>
                    )
                  })}
                  
                  <div className="mt-8 flex justify-end">
                    <Button 
                      onClick={handleNext}
                      size="lg"
                      className="bg-emerald-500 hover:bg-emerald-600 text-neutral-900"
                    >
                      Continue to Documents
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Right Help Panel */}
          <div className="fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-80 overflow-y-auto border-l border-neutral-800 bg-black">
            <HelpGuide />
          </div>
        </div>
      </div>
    </div>
  )
}
