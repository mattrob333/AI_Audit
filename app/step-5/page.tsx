'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ProgressSteps } from '@/components/progress-steps'
import { DocumentGenerator } from '@/components/document-generator'
import { DocumentType } from '@/lib/documents'
import { Card } from '@/components/ui/card'
import { Sidebar } from '@/components/sidebar'

export default function Step5Page() {
  const [selectedDoc, setSelectedDoc] = React.useState<DocumentType>('executiveSummary')

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar className="fixed left-0 top-0 h-full w-64" />
      
      <main className="flex-1 pl-64">
        <div className="sticky top-0 z-40 border-b border-neutral-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
          <ProgressSteps currentStep={5} />
        </div>
        
        <div className="px-8 py-12 min-h-[calc(100vh-4rem)]">
          <div className="max-w-[90rem] mx-auto">
            <div className="mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-neutral-50 mb-3">
                Final Documents
              </h1>
              <p className="text-lg text-neutral-400">
                Review and download your personalized AI integration documents.
              </p>
            </div>

            <div className="bg-neutral-900/50 rounded-xl border border-neutral-800/50 backdrop-blur-sm min-h-[800px]">
              <DocumentGenerator 
                selectedDocument={selectedDoc} 
                setSelectedDocument={setSelectedDoc} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
