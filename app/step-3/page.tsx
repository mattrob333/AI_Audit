'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ProgressSteps } from '@/components/progress-steps'
import { HelpGuide } from '@/components/help-guide'
import { QuestionForm } from '@/components/question-form'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'

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
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-40 bg-background">
        <ProgressSteps currentStep={3} />
      </div>
      <div className="flex-1 px-4 lg:px-8 py-6">
        <div className="mr-80">
          <div className="max-w-3xl">
            <div className="mb-12">
              <h1 className="mb-4 text-4xl font-bold tracking-tight">
                Company Audit
              </h1>
              <p className="text-lg text-muted-foreground">
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
        </div>
        <HelpGuide expanded={true} />
      </div>
    </div>
  )
}
