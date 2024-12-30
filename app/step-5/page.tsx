'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ProgressSteps } from '@/components/progress-steps'
import { DocumentGenerator } from '@/components/document-generator'

export default function Step5Page() {
  const [selectedDoc, setSelectedDoc] = React.useState('executive_summary')

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-40 bg-background">
        <ProgressSteps currentStep={5} />
      </div>
      <div className="flex-1 px-4 lg:px-8 py-6">
        <DocumentGenerator selectedDocument={selectedDoc} />
      </div>
    </div>
  )
}
