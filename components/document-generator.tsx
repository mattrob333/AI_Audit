'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { useState, useEffect } from 'react';
import { Check, ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocumentType, Step1Data, Step2Data, Step3Data } from '@/lib/types';
import { useDocumentStore } from '@/lib/store';
import { documentSteps } from '@/lib/document-steps';
import JSZip from 'jszip';

export function DocumentGenerator({ 
  selectedDocument, 
  setSelectedDocument 
}: { 
  selectedDocument?: DocumentType, 
  setSelectedDocument: (stepId: DocumentType) => void 
}) {
  const [currentDocument, setCurrentDocument] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'loading'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [step3Data, setStep3Data] = useState<Step3Data | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const step1Raw = localStorage.getItem('step1Data');
      const step2Raw = localStorage.getItem('step2Data');
      const step3Raw = localStorage.getItem('step3Data');

      if (step1Raw) {
        const data = JSON.parse(step1Raw);
        setStep1Data(data);
      }

      if (step2Raw) {
        const data = JSON.parse(step2Raw);
        setStep2Data(data);
      }

      if (step3Raw) {
        const data = JSON.parse(step3Raw);
        setStep3Data(data);
      }
    } catch (err) {
      console.error('Error loading data from localStorage:', err);
      setError('Error loading data from previous steps. Please ensure all steps are completed.');
    }
  }, []);

  const handleStepClick = (stepId: DocumentType) => {
    setSelectedDocument(stepId);
    setError(null);
  };

  const handleGenerate = async (docType: string) => {
    setGenerationStatus('loading');
    setError(null);

    if (!step1Data?.aiSummary || !step1Data?.userDescription) {
      setError('Missing required business details. Please complete Step 1 first.');
      setGenerationStatus('idle');
      return;
    }

    try {
      const userData = {
        // Step 1 data
        businessUrl: step1Data.businessUrl,
        aiSummary: step1Data.aiSummary,
        userDescription: step1Data.userDescription,

        // Step 2 data (optional)
        teamSize: step2Data?.teamSize,
        teamMembers: step2Data?.teamMembers,
        currentSoftware: step2Data?.currentSoftware,
        aiToolsOfInterest: step2Data?.aiToolsOfInterest,

        // Step 3 data (optional)
        keyChallenges: step3Data?.keyChallenges,
        strengths: step3Data?.strengths,
        integrationOpportunities: step3Data?.integrationOpportunities,
        implementationConsiderations: step3Data?.implementationConsiderations,
        timeline: step3Data?.timeline,
        trainingNeeds: step3Data?.trainingNeeds,
        complianceAndSecurity: step3Data?.complianceAndSecurity
      };

      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docType,
          userData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate document');
      }

      if (!data.document) {
        throw new Error('No document content received');
      }

      setCurrentDocument(data.document);
      setGenerationStatus('idle');
    } catch (err) {
      console.error('Error generating document:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate document');
      setGenerationStatus('idle');
    }
  };

  const handleDownload = (content: string, filename: string) => {
    try {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download document');
    }
  };

  const handleDownloadAll = async () => {
    try {
      if (!currentDocument) {
        throw new Error('No document content available');
      }

      const zip = new JSZip();
      documentSteps.forEach(step => {
        const filename = `${step.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
        zip.file(filename, currentDocument);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'all-documents.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download documents');
    }
  };

  return (
    <div className="grid grid-cols-[450px,1fr] divide-x divide-neutral-800 h-full">
      <div className="p-8 space-y-4">
        <h2 className="text-2xl font-semibold mb-6">Document Generator</h2>
        <div className="space-y-3">
          {documentSteps.map((step) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={cn(
                'w-full px-4 py-3 text-left transition-colors rounded-lg',
                selectedDocument === step.id
                  ? 'bg-emerald-500/20 text-emerald-500'
                  : 'hover:bg-neutral-800/50'
              )}
            >
              <div className="font-medium">{step.title}</div>
              <div className="text-sm text-neutral-400">{step.description}</div>
            </button>
          ))}
        </div>

        <div className="mt-8">
          {selectedDocument && (
            <Button
              onClick={() => handleGenerate(selectedDocument)}
              disabled={generationStatus === 'loading'}
              className="w-full"
            >
              {generationStatus === 'loading' ? (
                <>Generating...</>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Document
                </>
              )}
            </Button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="p-8">
        {currentDocument ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Generated Document</h3>
              <Button variant="outline" size="sm" onClick={() => handleDownload(currentDocument, 'document.txt')}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <ScrollArea className="h-[700px] w-full rounded-lg border border-neutral-800 bg-neutral-900/50">
              <div className="p-4">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  className="prose prose-invert max-w-none"
                >
                  {currentDocument}
                </ReactMarkdown>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-400">
            Select a document type and click Generate to create your document
          </div>
        )}
      </div>
    </div>
  );
}
