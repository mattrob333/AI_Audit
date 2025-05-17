'use client'

import { ProjectForm } from '@/components/project-form'
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
  const [summaryGenerated, setSummaryGenerated] = useState(false)

  const handleNext = () => {
    if (!formData?.aiSummary || !formData?.userDescription || !summaryGenerated) {
      toast({
        title: "Missing Information",
        description: "Please fill in your AI Vision and generate an AI analysis before proceeding.",
        variant: "destructive",
      })
      return
    }

    // Clear any existing overview data since we're starting a new analysis
    localStorage.removeItem('overview')
    localStorage.removeItem('overviewBusinessUrl')

    // Log data before saving
    console.log('Saving step 1 data:', formData);

    // Save step 1 data
    localStorage.setItem('step1Data', JSON.stringify(formData))
    
    // Verify data was saved correctly
    const savedData = localStorage.getItem('step1Data');
    console.log('Saved step 1 data:', savedData);
    
    // Navigate to the existing step-2 page
    router.push('/step-2')
  }

  return (
    <div className="flex min-h-screen bg-black">

      <main className="flex-1">
        <div className="sticky top-0 z-40 border-b border-neutral-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
          <ProgressSteps currentStep={1} />
        </div>
        
        <div className="px-8 py-12 min-h-[calc(100vh-4rem)]">
          <div className="max-w-[90rem] mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-neutral-50 mb-3">
                Transform Your Business with AI
              </h1>
              <p className="text-lg text-neutral-400">
                In just 5 minutes, discover how AI can revolutionize your operations, boost efficiency, and give you a competitive edge. Let's build your personalized AI roadmap together.
              </p>
            </div>

            <div className="bg-neutral-900/50 rounded-xl border border-neutral-800/50 backdrop-blur-sm">
              <div className="p-8">
                <ProjectForm 
                  formData={formData} 
                  setFormData={setFormData}
                  summaryGenerated={summaryGenerated}
                  setSummaryGenerated={setSummaryGenerated}
                  onFormDataChange={setFormData} 
                  onSummaryGenerated={() => setSummaryGenerated(true)} 
                  onNext={handleNext}
                />
                
                <div className="mt-8 flex justify-end">
                  <Button 
                    onClick={handleNext}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
                  >
                    Next Step
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <HelpPanel>
        <div className="space-y-4">
          <h4 className="font-medium">Getting Started</h4>
          <p className="text-sm text-neutral-400">
            Fill in your project details to get started with the AI audit process.
          </p>
        </div>
      </HelpPanel>
    </div>
  )
}
