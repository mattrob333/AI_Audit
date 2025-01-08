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
            <div className="mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-neutral-50 mb-3">
                Company Audit
              </h1>
              <p className="text-lg text-neutral-400">
                Answer these questions to help us tailor your AI integration plan.
              </p>
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
