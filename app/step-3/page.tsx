'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ProgressSteps } from '@/components/progress-steps'
import { HelpGuide } from '@/components/help-guide'
import { QuestionForm } from '@/components/question-form'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Sidebar } from '@/components/sidebar'
import { HelpPanel } from '@/components/help-panel'

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
        
        const businessDetails = JSON.parse(localStorage.getItem('businessDetails') || '{}')
        const teamDetails = JSON.parse(localStorage.getItem('teamDetails') || '{}')

        console.log('Business Details:', businessDetails)
        console.log('Team Details:', teamDetails)

        if (!businessDetails.businessName || !businessDetails.description || !teamDetails) {
          setError('Please complete the previous steps first')
          return
        }

        const response = await fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ businessDetails, teamDetails }),
        })

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json()
        console.log('API Response:', data)

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
      <Sidebar className="fixed left-0 top-0 h-full w-52" />
      
      <main className="flex-1 pl-52">
        <div className="sticky top-0 z-40 border-b border-neutral-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
          <ProgressSteps currentStep={3} />
        </div>
        
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-50">
              Company Audit
            </h1>
            <p className="mt-3 text-lg text-neutral-400">
              Answer these questions to help us tailor your AI integration plan.
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
          ) : (
            <QuestionForm questions={questions} onSubmit={handleSubmit} />
          )}
        </div>

        <HelpGuide 
          className="fixed top-[80px] right-8 w-72 h-[calc(100vh-112px)]"
          title="Answering the Audit"
          description="These questions help us understand your company's current state and readiness for AI integration."
        >
          <div className="space-y-4">
            <p>Tips for answering:</p>
            <ul className="list-disc pl-4 space-y-2">
              <li>Be specific about your current processes</li>
              <li>Include any pain points or challenges</li>
              <li>Mention any previous automation attempts</li>
              <li>Share your team's technical comfort level</li>
            </ul>
          </div>
        </HelpGuide>
      </main>
    </div>
  )
}
