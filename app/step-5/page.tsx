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
            <div className="space-y-6 mb-12">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight text-neutral-50">
                  Generate Your AI Integration Playbooks
                </h1>
                <p className="text-lg text-neutral-400">
                  Download or refine comprehensive documents that guide your AI journey across every department.
                </p>
              </div>

              <div className="space-y-4 p-4 bg-neutral-900/50 rounded-lg border border-neutral-800">
                <div className="space-y-2">
                  <h2 className="font-medium text-neutral-300">What You'll Get:</h2>
                  <ul className="list-disc list-inside space-y-1 text-neutral-400">
                    <li>Executive Summary: High-level overview of your AI strategy</li>
                    <li>Upskilling Documents: Training modules for each team member</li>
                    <li>AI Personas: Role-specific prompts or chatbots to assist with daily tasks</li>
                    <li>Automation Plan: Step-by-step instructions for implementing new workflows</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h2 className="font-medium text-neutral-300">Why It Matters:</h2>
                  <ul className="list-disc list-inside space-y-1 text-neutral-400">
                    <li>These ready-made docs let you hit the ground running with AI.</li>
                    <li>Customize them in-app with a rich text editor so each deliverable fits your exact needs.</li>
                  </ul>
                </div>
              </div>
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
