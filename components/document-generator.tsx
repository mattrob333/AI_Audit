'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import JSZip from 'jszip';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { Check, ChevronLeft, ChevronRight, Download, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DocumentType, generateDocument } from '@/lib/documents';

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

export function DocumentGenerator() {
  const [currentDoc, setCurrentDoc] = useState<DocumentType>('executiveSummary');
  const [generatedDocs, setGeneratedDocs] = useState<Record<DocumentType, string>>({
    executiveSummary: '',
    upskilling: '',
    aiPersonas: '',
    chatbot: '',
    automationPlan: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentIndex = documentSteps.findIndex(step => step.id === currentDoc);
  const currentStep = documentSteps[currentIndex];

  const handleGenerate = async () => {
    setIsGenerating(true);
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
      
      setGeneratedDocs(prev => ({
        ...prev,
        [currentDoc]: result
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const content = generatedDocs[currentDoc];
    if (!content) return;

    const fileName = `${currentStep.title.toLowerCase().replace(/\s+/g, '-')}.md`;
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
    
    Object.entries(generatedDocs).forEach(([docType, content]) => {
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
    if (currentIndex < documentSteps.length - 1) {
      setCurrentDoc(documentSteps[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentDoc(documentSteps[currentIndex - 1].id);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className="w-72 border-r bg-muted/20">
        <div className="p-4 font-semibold">Steps</div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          {documentSteps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setCurrentDoc(step.id)}
              className={cn(
                "w-full px-4 py-3 text-left hover:bg-accent/50 flex items-center gap-3",
                currentDoc === step.id && "bg-accent"
              )}
            >
              <div className={cn(
                "w-6 h-6 rounded-full border flex items-center justify-center",
                generatedDocs[step.id] ? "bg-green-500 border-green-500" : "border-muted-foreground"
              )}>
                {generatedDocs[step.id] && <Check className="w-4 h-4 text-white" />}
              </div>
              <div>
                <div className="font-medium">{step.title}</div>
                <div className="text-sm text-muted-foreground">{step.description}</div>
              </div>
            </button>
          ))}
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-2">{currentStep.title}</h1>
          <p className="text-muted-foreground mb-6">{currentStep.description}</p>

          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
              {error}
            </div>
          )}

          {generatedDocs[currentDoc] ? (
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
                  {generatedDocs[currentDoc]}
                </ReactMarkdown>
              </div>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-[calc(100vh-15rem)] border rounded-md">
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                <FileText className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate Document'}
              </Button>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="border-t p-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous Step
          </Button>

          <div className="flex gap-2">
            {generatedDocs[currentDoc] && (
              <>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Doc
                </Button>
                {Object.keys(generatedDocs).length > 1 && (
                  <Button variant="outline" onClick={handleDownloadAll}>
                    <Download className="mr-2 h-4 w-4" />
                    Download All
                  </Button>
                )}
              </>
            )}
            <Button
              onClick={handleNext}
              disabled={currentIndex === documentSteps.length - 1 || !generatedDocs[currentDoc]}
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