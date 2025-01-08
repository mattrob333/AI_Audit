'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ProgressSteps } from '@/components/progress-steps'
import { QuestionForm } from '@/components/question-form'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Sidebar } from '@/components/sidebar'
import { HelpPanel } from '@/components/help-panel'
import { BusinessDetails, TeamDetails } from '@/lib/types'

export default function Step3Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const generateQuestions = async () => {
      try {
        setLoading(true)
        setError('')
        
        const businessDetails: BusinessDetails = JSON.parse(localStorage.getItem('step1Data') || '{}')
        const teamDetails: TeamDetails = JSON.parse(localStorage.getItem('teamDetails') || '{}')

        if (!businessDetails.businessUrl || !businessDetails.aiSummary || !teamDetails.teamMembers) {
          setError('Please complete the previous steps first')
          return
        }

        const response = await fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ businessDetails, teamDetails }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.error)
        }
        
        if (!data.questions || !Array.isArray(data.questions)) {
          throw new Error('Invalid response format')
        }

        const formattedQuestions = data.questions.map((text: string, index: number) => ({
          id: index + 1,
          text,
          answer: '',
          isSkipped: false
        }))

        setQuestions(formattedQuestions)
      } catch (err: any) {
        console.error('Error details:', err)
        setError(err.message || 'Failed to generate questions')
      } finally {
        setLoading(false)
      }
    }

    generateQuestions()
  }, [])

  const handleSubmit = async (answers: any[]) => {
    localStorage.setItem('auditAnswers', JSON.stringify(answers))
    router.push('/step-4')
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar className="fixed left-0 top-0 h-full w-64" />
      
      <main className="flex-1 pl-64">
        <div className="sticky top-0 z-40 border-b border-neutral-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
          <ProgressSteps currentStep={3} />
        </div>
        
        <div className="px-8 py-12 min-h-[calc(100vh-4rem)]">
          <div className="max-w-[90rem] mx-auto">
            <div className="space-y-6 mb-12">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-neutral-50">
                  Pinpoint Your Workflows & Bottlenecks
                </h1>
                <p className="text-lg text-neutral-400">
                  Provide deeper insight into your processes so we can find high-impact AI solutions.
                </p>
              </div>

              <div className="space-y-4 p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                <div className="space-y-2">
                  <h2 className="font-medium text-neutral-300">What We'll Need:</h2>
                  <ul className="list-disc list-inside space-y-1 text-neutral-400">
                    <li>Details on key workflows or processes (e.g., lead management, invoice handling)</li>
                    <li>Known pain points or bottlenecks (time sinks, manual tasks, error-prone steps)</li>
                    <li>Current data handling practices (where data is stored, data privacy)</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h2 className="font-medium text-neutral-300">Why It Matters:</h2>
                  <ul className="list-disc list-inside space-y-1 text-neutral-400">
                    <li>The more we know about your operational flow, the better we can recommend AI automations.</li>
                    <li>Targeted questions help us diagnose exactly where AI will have the most impact.</li>
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
            ) : (
              <QuestionForm questions={questions} onSubmit={handleSubmit} />
            )}
          </div>
        </div>
      </main>

      <HelpPanel>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-neutral-200 mb-2">Answering the Audit</h3>
            <p className="text-sm text-neutral-400">
              These questions help us understand your company's current processes and readiness for AI integration.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-300">Tips for answering:</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>• Be specific about your current processes</li>
              <li>• Include any pain points or challenges</li>
              <li>• Mention any previous automation attempts</li>
              <li>• Share your team's technical comfort level</li>
            </ul>
          </div>
        </div>
      </HelpPanel>
    </div>
  )
}
