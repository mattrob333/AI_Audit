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
      
      <div className="flex flex-1 flex-col pl-64">
        <div className="sticky top-0 z-40 border-b border-neutral-800 bg-black/95 backdrop-blur">
          <ProgressSteps currentStep={5} />
        </div>
        
        <div className="flex flex-1">
          <div className="flex-1 px-4 lg:px-8 py-6 space-y-8">
            <Card className="border-neutral-800 bg-neutral-900/50 p-6">
              <DocumentGenerator selectedDocument={selectedDoc} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
