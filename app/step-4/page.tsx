'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ProgressSteps } from '@/components/progress-steps'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CollapsibleSection } from '@/components/ui/collapsible-section'
import { ArrowRight } from 'lucide-react'
import { Sidebar } from '@/components/sidebar'
import { HelpPanel } from '@/components/help-panel'

interface Timeline {
  phase1_assessment: string;
  phase2_implementation: string;
  phase3_expansion: string;
}

interface OverviewData {
  businessOverview: string;
  keyChallenges: string[];
  strengths: string[];
  integrationOpportunities: string[];
  implementationConsiderations: string[];
  timeline: Timeline;
  trainingNeeds: string[];
  complianceAndSecurity: string[];
}

export default function Step4Page() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const [overview, setOverview] = React.useState<OverviewData | null>(null)

  const formatTitle = (title: string) => {
    return title
      .split(/(?=[A-Z])|_/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  const renderTimelineContent = (timeline: Timeline) => {
    return Object.entries(timeline).map(([phase, description]) => (
      <div key={phase} className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-200">{formatTitle(phase)}</h3>
        <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>
      </div>
    ))
  }

  const validateOverviewData = (data: any): data is OverviewData => {
    if (typeof data !== 'object' || data === null) return false;
    
    if (typeof data.businessOverview !== 'string') return false;
    
    const arrayFields = [
      'keyChallenges',
      'strengths',
      'integrationOpportunities',
      'implementationConsiderations',
      'trainingNeeds',
      'complianceAndSecurity'
    ];
    
    for (const field of arrayFields) {
      if (!Array.isArray(data[field])) {
        console.error(`Field ${field} is not an array:`, data[field]);
        return false;
      }
      if (!data[field].every((item: any) => typeof item === 'string')) {
        console.error(`Field ${field} contains non-string items:`, data[field]);
        return false;
      }
    }
    
    if (typeof data.timeline !== 'object' || data.timeline === null) {
      console.error('Timeline is not an object:', data.timeline);
      return false;
    }
    const requiredPhases = ['phase1_assessment', 'phase2_implementation', 'phase3_expansion'];
    for (const phase of requiredPhases) {
      if (typeof data.timeline[phase] !== 'string') {
        console.error(`Timeline phase ${phase} is not a string:`, data.timeline[phase]);
        return false;
      }
    }
    
    return true;
  }

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        const step1DataStr = localStorage.getItem('step1Data')
        if (!step1DataStr) {
          throw new Error('Missing business details from Step 1')
        }
        const step1Data = JSON.parse(step1DataStr)
        
        if (!step1Data.businessUrl || !step1Data.aiSummary) {
          throw new Error('Missing required business details from Step 1')
        }

        // Get cached overview and its associated business URL
        const overviewStr = localStorage.getItem('overview')
        const cachedBusinessUrl = localStorage.getItem('overviewBusinessUrl')
        let overviewData = null

        // Only use cached data if it's for the same business
        if (overviewStr && cachedBusinessUrl === step1Data.businessUrl) {
          overviewData = JSON.parse(overviewStr)
        }

        if (!overviewData) {
          const response = await fetch('/api/generate-overview', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              businessUrl: step1Data.businessUrl,
              aiSummary: step1Data.aiSummary,
              userDescription: step1Data.userDescription
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.error('API Error:', errorData);
            throw new Error(errorData.error || 'Failed to generate overview')
          }

          overviewData = await response.json()
          console.log('Received overview data:', overviewData);
          // Store both the overview and the business URL it's associated with
          localStorage.setItem('overview', JSON.stringify(overviewData))
          localStorage.setItem('overviewBusinessUrl', step1Data.businessUrl)
        }

        if (validateOverviewData(overviewData)) {
          setOverview(overviewData)
        } else {
          throw new Error('Invalid overview data structure')
        }
      } catch (err: any) {
        setError(err.message || 'Failed to generate overview')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleNext = () => {
    router.push('/step-5')
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar className="fixed left-0 top-0 h-full w-64" />
      
      <main className="flex-1 pl-64">
        <div className="sticky top-0 z-40 border-b border-neutral-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
          <ProgressSteps currentStep={4} />
        </div>

        <div className="px-8 py-12 min-h-[calc(100vh-4rem)]">
          <div className="max-w-[90rem] mx-auto">
            <div className="space-y-6 mb-12">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-neutral-50">
                  Tailored Strategies & Quick Wins
                </h1>
                <p className="text-lg text-neutral-400">
                  Review personalized AI suggestions based on your business context, team data, and audit details.
                </p>
              </div>

              <div className="space-y-4 p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                <div className="space-y-2">
                  <h2 className="font-medium text-neutral-300">What You'll See:</h2>
                  <ul className="list-disc list-inside space-y-1 text-neutral-400">
                    <li>Immediate improvements you can implement (e.g., chatbot, automated email summaries)</li>
                    <li>Longer-term opportunities (e.g., advanced analytics, process re-engineering)</li>
                    <li>Industry best practices aligned with your goals</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h2 className="font-medium text-neutral-300">Why It Matters:</h2>
                  <ul className="list-disc list-inside space-y-1 text-neutral-400">
                    <li>This step gives you a clear action plan to start harnessing AI.</li>
                    <li>By focusing on both "quick wins" and "long-term vision," you'll see a roadmap for sustainable AI adoption.</li>
                  </ul>
                </div>
              </div>
            </div>

            {error ? (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : loading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner className="w-8 h-8 text-neutral-400" />
              </div>
            ) : overview ? (
              <div className="space-y-6">
                {Object.entries(overview).map(([section, content]) => {
                  const formattedTitle = formatTitle(section)
                  
                  let renderedContent: React.ReactNode = null;
                  if (section === 'timeline' && content && typeof content === 'object') {
                    renderedContent = renderTimelineContent(content as Timeline);
                  } else if (typeof content === 'string') {
                    renderedContent = (
                      <div 
                        className="text-sm text-neutral-400 leading-relaxed" 
                        dangerouslySetInnerHTML={{ __html: content }} 
                      />
                    );
                  } else if (Array.isArray(content)) {
                    renderedContent = (
                      <ul className="space-y-3">
                        {content.map((item, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-neutral-400">
                            <span className="select-none">•</span>
                            <span className="flex-1">{typeof item === 'string' ? item : JSON.stringify(item)}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  } else {
                    renderedContent = (
                      <pre className="whitespace-pre-wrap text-sm text-neutral-400">
                        {JSON.stringify(content, null, 2)}
                      </pre>
                    );
                  }
                  
                  return (
                    <div key={section} className="rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
                      <CollapsibleSection
                        title={formattedTitle}
                        defaultExpanded={true}
                        className="px-6 py-4"
                      >
                        <div className="mt-4 space-y-4">
                          {renderedContent}
                        </div>
                      </CollapsibleSection>
                    </div>
                  )
                })}
                
                <div className="flex justify-end pt-8">
                  <Button 
                    onClick={handleNext}
                    size="lg"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
                  >
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      <HelpPanel>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-neutral-200 mb-2">About the Overview</h3>
            <p className="text-sm text-neutral-400">
              This overview provides a comprehensive analysis of your business and outlines the recommended AI integration strategy.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-300">Key Sections:</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>• Business Overview - Summary of your company</li>
              <li>• Key Challenges - Current issues to address</li>
              <li>• Strengths - Your competitive advantages</li>
              <li>• Integration Opportunities - Areas for AI implementation</li>
              <li>• Timeline - Phased implementation plan</li>
            </ul>
          </div>
        </div>
      </HelpPanel>
    </div>
  )
}
