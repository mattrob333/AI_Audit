'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import JSZip from 'jszip';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Check, ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocumentType, generateDocument } from '@/lib/documents';
import { DocumentSteps } from './document-steps';

const documentSteps: Array<{
  id: DocumentType;
  title: string;
  description: string;
}> = [
  {
    id: 'executiveSummary',
    title: 'Executive Summary',
    description: 'High-level overview of your business and AI implementation strategy'
  },
  {
    id: 'upskilling',
    title: 'Upskilling Documents',
    description: 'Training modules for team skill development'
  },
  {
    id: 'aiPersonas',
    title: 'AI Personas',
    description: 'Four AI personas for Marketing, Sales, Operations, and Research'
  },
  {
    id: 'chatbot',
    title: 'Customer-Facing Chatbot',
    description: 'Chatbot configuration and knowledge base'
  },
  {
    id: 'automationPlan',
    title: 'Automation Plan',
    description: 'Custom software automations and AI integration roadmap'
  }
];

export function DocumentGenerator({ selectedDocument }: { selectedDocument?: DocumentType }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [documents, setDocuments] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<string | null>(null);

  // Update currentStep when selectedDocument changes
  useEffect(() => {
    if (selectedDocument) {
      const stepIndex = documentSteps.findIndex(step => step.id === selectedDocument);
      if (stepIndex !== -1) {
        setCurrentStep(stepIndex);
      }
    }
  }, [selectedDocument]);

  const [error, setError] = useState<string | null>(null);

  const currentDoc = documentSteps[currentStep].id;

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      // Get all the user data from previous steps
      const businessDetails = JSON.parse(localStorage.getItem('businessDetails') || '{}');
      const teamDetails = JSON.parse(localStorage.getItem('teamDetails') || '{}');
      const aiPlanOverview = JSON.parse(localStorage.getItem('aiPlanOverview') || '{}');

      const result = await generateDocument(currentDoc, {
        businessName: businessDetails.businessName,
        industry: businessDetails.industry,
        teamSize: teamDetails.teamSize,
        currentTools: teamDetails.currentTools,
        overview: aiPlanOverview
      });
      
      setDocuments(prev => ({
        ...prev,
        [currentDoc]: result
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    const content = documents[currentDoc];
    if (!content) return;

    const fileName = `${documentSteps[currentStep].title.toLowerCase().replace(/\s+/g, '-')}.md`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    const zip = new JSZip();
    
    Object.entries(documents).forEach(([docType, content]) => {
      const step = documentSteps.find(s => s.id === docType);
      if (step) {
        const fileName = `${step.title.toLowerCase().replace(/\s+/g, '-')}.md`;
        zip.file(fileName, content);
      }
    });

    zip.generateAsync({ type: 'blob' }).then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'all-documents.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const handleNext = () => {
    if (currentStep < documentSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-64 shrink-0">
        <DocumentSteps
          steps={documentSteps}
          currentStep={currentStep}
          onStepClick={setCurrentStep}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-2">{documentSteps[currentStep].title}</h1>
          <p className="text-muted-foreground mb-6">{documentSteps[currentStep].description}</p>

          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
              {error}
            </div>
          )}

          {documents[currentDoc] ? (
            <ScrollArea className="h-[calc(100vh-15rem)] border rounded-md p-4">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-semibold mt-5 mb-3">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    code: ({ children }) => (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{children}</code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-muted p-4 rounded-md overflow-x-auto mb-4">{children}</pre>
                    ),
                  }}
                >
                  {documents[currentDoc]}
                </ReactMarkdown>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-[calc(100vh-15rem)] border rounded-md">
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={generating}
              >
                <FileText className="mr-2 h-4 w-4" />
                {generating ? 'Generating...' : 'Generate Document'}
              </Button>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="border-t p-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous Step
          </Button>

          <div className="flex gap-2">
            {documents[currentDoc] && (
              <>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Doc
                </Button>
                {Object.keys(documents).length > 1 && (
                  <Button variant="outline" onClick={handleDownloadAll}>
                    <Download className="mr-2 h-4 w-4" />
                    Download All
                  </Button>
                )}
              </>
            )}
            <Button
              onClick={handleNext}
              disabled={currentStep === documentSteps.length - 1 || !documents[currentDoc]}
            >
              Next Step
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
