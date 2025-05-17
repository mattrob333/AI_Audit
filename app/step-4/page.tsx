'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ProgressSteps } from '@/components/progress-steps'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CollapsibleSection } from '@/components/ui/collapsible-section'
import { ArrowRight } from 'lucide-react'
import { HelpPanel } from '@/components/help-panel'
import { QuickWinCard } from '@/components/quick-win-card'
import { LongTermCard } from '@/components/long-term-card'
import { Zap, Target, TrendingUp } from 'lucide-react'

interface Timeline {
  phase1_assessment: {
    duration: string;
    activities: string[];
    deliverables: string[];
  };
  phase2_implementation: {
    duration: string;
    activities: string[];
    deliverables: string[];
  };
  phase3_expansion: {
    duration: string;
    activities: string[];
    deliverables: string[];
  };
}

interface QuickWin {
  title: string;
  description: string;
  estimatedTimeSavedPerWeek: string;
  roiPotential: string;
  implementationComplexity: 'Low' | 'Medium' | 'High';
  steps: string[];
}

interface LongTermOpportunity {
  title: string;
  description: string;
  timeHorizon: string;
  roiPotential: string;
  strategicValue: 'High' | 'Very High' | 'Transformative';
  keyMilestones: string[];
}

interface IndustryTrend {
  trend: string;
  impact: string;
  adoptionRate: string;
  relevance: string;
  recommendations: string[];
}

interface Challenge {
  challenge: string;
  impact: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface Strength {
  area: string;
  description: string;
  leverageOpportunity: string;
}

interface IntegrationOpportunity {
  area: string;
  description: string;
  benefit: string;
  prerequisite: string;
}

interface ImplementationConsideration {
  category: string;
  points: string[];
  risksAndMitigation: string[];
}

interface BusinessOverview {
  summary: string;
  vision: string;
  objectives: string[];
}

interface OverviewData {
  businessOverview: BusinessOverview;
  keyChallenges: Challenge[];
  strengths: Strength[];
  integrationOpportunities: IntegrationOpportunity[];
  implementationConsiderations: ImplementationConsideration[];
  timeline: Timeline;
  quickWins: QuickWin[];
  longTermOpportunities: LongTermOpportunity[];
  industryTrends: IndustryTrend[];
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
    return Object.entries(timeline).map(([phase, content]) => (
      <div key={phase} className="space-y-2">
        <h3 className="text-sm font-medium text-neutral-200">{formatTitle(phase)}</h3>
        <p className="text-sm text-neutral-400 leading-relaxed">{content.duration}</p>
        <ul className="list-disc list-inside space-y-1 text-sm text-neutral-400">
          {content.activities.map((activity: string, index: number) => (
            <li key={index}>{activity}</li>
          ))}
        </ul>
        <ul className="list-disc list-inside space-y-1 text-sm text-neutral-400">
          {content.deliverables.map((deliverable: string, index: number) => (
            <li key={index}>{deliverable}</li>
          ))}
        </ul>
      </div>
    ))
  }

  const validateOverviewData = (data: any): data is OverviewData => {
    if (typeof data !== 'object' || data === null) return false;
    
    if (typeof data.businessOverview !== 'object' || data.businessOverview === null) return false;
    if (typeof data.businessOverview.summary !== 'string') return false;
    if (typeof data.businessOverview.vision !== 'string') return false;
    if (!Array.isArray(data.businessOverview.objectives)) return false;
    if (!data.businessOverview.objectives.every((objective: any) => typeof objective === 'string')) return false;
    
    const arrayFields = [
      'keyChallenges',
      'strengths',
      'integrationOpportunities',
      'implementationConsiderations',
      'quickWins',
      'longTermOpportunities',
      'industryTrends'
    ];
    
    for (const field of arrayFields) {
      if (!Array.isArray(data[field])) {
        console.error(`Field ${field} is not an array:`, data[field]);
        return false;
      }
    }
    
    if (typeof data.timeline !== 'object' || data.timeline === null) {
      console.error('Timeline is not an object:', data.timeline);
      return false;
    }
    const requiredPhases = ['phase1_assessment', 'phase2_implementation', 'phase3_expansion'];
    for (const phase of requiredPhases) {
      if (typeof data.timeline[phase] !== 'object' || data.timeline[phase] === null) {
        console.error(`Timeline phase ${phase} is not an object:`, data.timeline[phase]);
        return false;
      }
      if (typeof data.timeline[phase].duration !== 'string') {
        console.error(`Timeline phase ${phase} duration is not a string:`, data.timeline[phase].duration);
        return false;
      }
      if (!Array.isArray(data.timeline[phase].activities)) {
        console.error(`Timeline phase ${phase} activities is not an array:`, data.timeline[phase].activities);
        return false;
      }
      if (!data.timeline[phase].activities.every((activity: any) => typeof activity === 'string')) {
        console.error(`Timeline phase ${phase} activities contains non-string items:`, data.timeline[phase].activities);
        return false;
      }
      if (!Array.isArray(data.timeline[phase].deliverables)) {
        console.error(`Timeline phase ${phase} deliverables is not an array:`, data.timeline[phase].deliverables);
        return false;
      }
      if (!data.timeline[phase].deliverables.every((deliverable: any) => typeof deliverable === 'string')) {
        console.error(`Timeline phase ${phase} deliverables contains non-string items:`, data.timeline[phase].deliverables);
        return false;
      }
    }
    
    if (!data.quickWins.every((quickWin: any) => {
      return (
        typeof quickWin === 'object' &&
        quickWin !== null &&
        typeof quickWin.title === 'string' &&
        typeof quickWin.description === 'string' &&
        typeof quickWin.estimatedTimeSavedPerWeek === 'string' &&
        typeof quickWin.roiPotential === 'string' &&
        ['Low', 'Medium', 'High'].includes(quickWin.implementationComplexity) &&
        Array.isArray(quickWin.steps) &&
        quickWin.steps.every((step: any) => typeof step === 'string')
      );
    })) {
      console.error('Invalid quick win object structure:', data.quickWins);
      return false;
    }
    
    if (!data.longTermOpportunities.every((opportunity: any) => {
      return (
        typeof opportunity === 'object' &&
        opportunity !== null &&
        typeof opportunity.title === 'string' &&
        typeof opportunity.description === 'string' &&
        typeof opportunity.timeHorizon === 'string' &&
        typeof opportunity.roiPotential === 'string' &&
        ['High', 'Very High', 'Transformative'].includes(opportunity.strategicValue) &&
        Array.isArray(opportunity.keyMilestones) &&
        opportunity.keyMilestones.every((milestone: any) => typeof milestone === 'string')
      );
    })) {
      console.error('Invalid long term opportunity object structure:', data.longTermOpportunities);
      return false;
    }
    
    if (!data.industryTrends.every((trend: any) => {
      return (
        typeof trend === 'object' &&
        trend !== null &&
        typeof trend.trend === 'string' &&
        typeof trend.impact === 'string' &&
        typeof trend.adoptionRate === 'string' &&
        typeof trend.relevance === 'string' &&
        Array.isArray(trend.recommendations) &&
        trend.recommendations.every((recommendation: any) => typeof recommendation === 'string')
      );
    })) {
      console.error('Invalid industry trend object structure:', data.industryTrends);
      return false;
    }
    
    return true;
  }

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError('')

        // Get cached overview data
        const overviewStr = localStorage.getItem('overview')
        const cachedBusinessUrl = localStorage.getItem('overviewBusinessUrl')
        
        if (!overviewStr || !cachedBusinessUrl) {
          throw new Error('Overview data not found. Please complete step 3 first.')
        }

        const overviewData = JSON.parse(overviewStr)
        
        if (validateOverviewData(overviewData)) {
          setOverview(overviewData)
        } else {
          throw new Error('Invalid overview data structure')
        }
      } catch (err: any) {
        console.error('Error loading overview:', err)
        setError(err.message || 'Failed to load overview')
        router.push('/step-3') // Redirect back to step 3 if data is missing
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleNext = () => {
    router.push('/step-5')
  }

  return (
    <div className="flex min-h-screen bg-black">

      <main className="flex-1">
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
                {/* Quick Wins Section */}
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
                  <CollapsibleSection
                    title={
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-blue-400" />
                        <span>Quick Wins</span>
                      </div>
                    }
                    defaultExpanded={true}
                    className="px-6 py-4"
                  >
                    <div className="mt-4 space-y-4">
                      {overview.quickWins?.map((quickWin, index: number) => (
                        <QuickWinCard key={index} quickWin={quickWin} />
                      ))}
                    </div>
                  </CollapsibleSection>
                </div>

                {/* Long-term Opportunities Section */}
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
                  <CollapsibleSection
                    title={
                      <div className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-400" />
                        <span>Strategic Opportunities</span>
                      </div>
                    }
                    defaultExpanded={true}
                    className="px-6 py-4"
                  >
                    <div className="mt-4 space-y-4">
                      {overview.longTermOpportunities?.map((opportunity, index: number) => (
                        <LongTermCard key={index} opportunity={opportunity} />
                      ))}
                    </div>
                  </CollapsibleSection>
                </div>

                {/* Industry Trends Section */}
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
                  <CollapsibleSection
                    title={
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-emerald-400" />
                        <span>Industry Trends</span>
                      </div>
                    }
                    defaultExpanded={true}
                    className="px-6 py-4"
                  >
                    <div className="mt-4 space-y-4">
                      {overview.industryTrends?.map((trend, index: number) => (
                        <div key={index} className="space-y-3 p-4 rounded-lg bg-neutral-800/50">
                          <h4 className="font-medium text-neutral-200">{trend.trend}</h4>
                          <p className="text-sm text-neutral-400">{trend.impact}</p>
                          <div className="text-sm">
                            <span className="text-emerald-400 font-medium">Adoption Rate: </span>
                            <span className="text-neutral-300">{trend.adoptionRate}</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-emerald-400 font-medium">Relevance: </span>
                            <span className="text-neutral-300">{trend.relevance}</span>
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-sm text-neutral-400">
                            {trend.recommendations.map((recommendation, index: number) => (
                              <li key={index}>{recommendation}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                </div>

                {/* Timeline Section */}
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
                  <CollapsibleSection
                    title={
                      <div className="flex items-center gap-2">
                        <span>Implementation Timeline</span>
                      </div>
                    }
                    defaultExpanded={true}
                    className="px-6 py-4"
                  >
                    <div className="mt-4 space-y-4">
                      {renderTimelineContent(overview.timeline)}
                    </div>
                  </CollapsibleSection>
                </div>

                {/* Business Overview Section */}
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
                  <CollapsibleSection
                    title={
                      <div className="flex items-center gap-2">
                        <span>Business Overview</span>
                      </div>
                    }
                    defaultExpanded={true}
                    className="px-6 py-4"
                  >
                    <div className="mt-4 space-y-4">
                      <p className="text-sm text-neutral-400 leading-relaxed">{overview.businessOverview.summary}</p>
                      <p className="text-sm text-neutral-400 leading-relaxed">{overview.businessOverview.vision}</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-neutral-400">
                        {overview.businessOverview.objectives.map((objective, index: number) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                  </CollapsibleSection>
                </div>

                {/* Key Challenges Section */}
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
                  <CollapsibleSection
                    title={
                      <div className="flex items-center gap-2">
                        <span>Key Challenges</span>
                      </div>
                    }
                    defaultExpanded={true}
                    className="px-6 py-4"
                  >
                    <div className="mt-4 space-y-4">
                      <ul className="list-disc list-inside space-y-1 text-sm text-neutral-400">
                        {overview.keyChallenges.map((challenge, index: number) => (
                          <li key={index}>
                            <span className="font-medium">{challenge.challenge}</span>
                            <p className="text-sm text-neutral-400 leading-relaxed">{challenge.impact}</p>
                            <p className="text-sm text-neutral-400 leading-relaxed">Priority: {challenge.priority}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CollapsibleSection>
                </div>

                {/* Strengths Section */}
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
                  <CollapsibleSection
                    title={
                      <div className="flex items-center gap-2">
                        <span>Strengths</span>
                      </div>
                    }
                    defaultExpanded={true}
                    className="px-6 py-4"
                  >
                    <div className="mt-4 space-y-4">
                      <ul className="list-disc list-inside space-y-1 text-sm text-neutral-400">
                        {overview.strengths.map((strength, index: number) => (
                          <li key={index}>
                            <span className="font-medium">{strength.area}</span>
                            <p className="text-sm text-neutral-400 leading-relaxed">{strength.description}</p>
                            <p className="text-sm text-neutral-400 leading-relaxed">Leverage Opportunity: {strength.leverageOpportunity}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CollapsibleSection>
                </div>

                {/* Integration Opportunities Section */}
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
                  <CollapsibleSection
                    title={
                      <div className="flex items-center gap-2">
                        <span>Integration Opportunities</span>
                      </div>
                    }
                    defaultExpanded={true}
                    className="px-6 py-4"
                  >
                    <div className="mt-4 space-y-4">
                      <ul className="list-disc list-inside space-y-1 text-sm text-neutral-400">
                        {overview.integrationOpportunities.map((opportunity, index: number) => (
                          <li key={index}>
                            <span className="font-medium">{opportunity.area}</span>
                            <p className="text-sm text-neutral-400 leading-relaxed">{opportunity.description}</p>
                            <p className="text-sm text-neutral-400 leading-relaxed">Benefit: {opportunity.benefit}</p>
                            <p className="text-sm text-neutral-400 leading-relaxed">Prerequisite: {opportunity.prerequisite}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CollapsibleSection>
                </div>

                {/* Implementation Considerations Section */}
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
                  <CollapsibleSection
                    title={
                      <div className="flex items-center gap-2">
                        <span>Implementation Considerations</span>
                      </div>
                    }
                    defaultExpanded={true}
                    className="px-6 py-4"
                  >
                    <div className="mt-4 space-y-4">
                      <ul className="list-disc list-inside space-y-1 text-sm text-neutral-400">
                        {overview.implementationConsiderations.map((consideration, index: number) => (
                          <li key={index}>
                            <span className="font-medium">{consideration.category}</span>
                            <ul className="list-disc list-inside space-y-1 text-sm text-neutral-400">
                              {consideration.points.map((point, index: number) => (
                                <li key={index}>{point}</li>
                              ))}
                            </ul>
                            <p className="text-sm text-neutral-400 leading-relaxed">Risks and Mitigation: {consideration.risksAndMitigation.join(', ')}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CollapsibleSection>
                </div>
                
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
