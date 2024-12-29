'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider } from '@/components/ui/sidebar'
import { MainNav } from '@/components/main-nav'
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
        if (data.error) {
          throw new Error(data.error)
        }
        
        if (!data.questions || !Array.isArray(data.questions)) {
          throw new Error('Invalid response format')
        }
        
        setQuestions(data.questions.map((q: string, i: number) => ({
          id: i + 1,
          text: q,
          answer: '',
          isSkipped: false
        })))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate questions')
      } finally {
        setLoading(false)
      }
    }

    generateQuestions()
  }, [])

  const handleSubmit = async (questions: any[]) => {
    localStorage.setItem('auditAnswers', JSON.stringify(questions))
    router.push('/step-4')
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <MainNav />
          <div className="flex-1 flex flex-col">
            <ProgressSteps currentStep={3} />
            <div className="flex-1 px-4 lg:pl-[120px] lg:pr-8">
              <div className="mr-80 ml-40">
                <h1 className="text-3xl font-semibold tracking-tight mb-2">Complete Your Company Audit</h1>
                <p className="text-muted-foreground mb-8">
                  Answer these questions to help us tailor your AI integration plan.
                </p>

                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <QuestionForm questions={questions} onSubmit={handleSubmit} />
                )}
              </div>
              <HelpGuide expanded={true} />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}
