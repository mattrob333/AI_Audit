'use client'

import { ProjectForm } from '@/components/project-form'
import { Sidebar } from '@/components/sidebar'
import { ProgressSteps } from '@/components/progress-steps'
import { HelpPanel } from '@/components/help-panel'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'

export default function Page() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<{
    businessUrl: string
    aiSummary: string
    userDescription: string
  } | null>(null)

  const handleNext = () => {
    if (!formData?.businessUrl || !formData?.aiSummary) {
      toast({
        title: "Missing Information",
        description: "Please enter your company URL and generate an AI analysis before proceeding.",
        variant: "destructive",
      })
      return
    }

    // Save step 1 data
    localStorage.setItem('step1Data', JSON.stringify(formData))
    
    // Navigate to the existing step-2 page
    router.push('/step-2')
  }

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar className="fixed left-0 top-0 h-full w-52" />
      
      <main className="flex-1 pl-52">
        <div className="sticky top-0 z-40 border-b border-neutral-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
          <ProgressSteps currentStep={1} />
        </div>
        
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-neutral-50">
              Transform Your Business with AI
            </h1>
            <p className="mt-3 text-lg text-neutral-400 leading-relaxed">
              In just 5 minutes, discover how AI can revolutionize your operations, boost efficiency, 
              and give you a competitive edge. Let's build your personalized AI roadmap together.
            </p>
          </div>

          <ProjectForm onFormDataChange={setFormData} />

          <div className="mt-8 flex justify-end">
            <Button 
              onClick={handleNext}
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-600 text-neutral-900"
            >
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>

      <HelpPanel />
    </div>
  )
}
