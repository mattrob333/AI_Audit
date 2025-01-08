'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { Sidebar } from '@/components/sidebar';
import { ProgressSteps } from '@/components/progress-steps';
import { HelpPanel } from '@/components/help-panel';
import { CompanyAudit } from '@/components/company-audit';

export default function CompanyAuditPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    // Check if all questions are answered
    const requiredQuestions = [1, 2, 3, 4, 5];
    const unansweredQuestions = requiredQuestions.filter(
      (id) => !answers[id]?.trim()
    );

    if (unansweredQuestions.length > 0) {
      toast({
        title: 'Missing Answers',
        description: 'Please answer all questions before proceeding.',
        variant: 'destructive',
      });
      return;
    }

    // Save answers to localStorage
    localStorage.setItem('companyAuditAnswers', JSON.stringify(answers));
    
    // Navigate to the next step
    router.push('/step-4');
  };

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar className="fixed left-0 top-0 h-full w-64" />
      
      <main className="flex-1 pl-64">
        <div className="sticky top-0 z-40 border-b border-neutral-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
          <ProgressSteps currentStep={3} />
        </div>
        
        <div className="px-8 py-12 min-h-[calc(100vh-4rem)]">
          <div className="max-w-[90rem] mx-auto">
            <CompanyAudit
              answers={answers}
              onAnswerChange={handleAnswerChange}
              onNext={handleNext}
            />
          </div>
        </div>
      </main>

      <HelpPanel>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-neutral-200 mb-2">Answering the Audit</h3>
            <p className="text-sm text-neutral-400">
              These questions help us understand your company's current processes and readiness for AI integration.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-300">Tips for answering:</h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>• Be specific about your current processes</li>
              <li>• Include any pain points or challenges</li>
              <li>• Mention any previous automation attempts</li>
              <li>• Share your team's technical comfort level</li>
            </ul>
          </div>
        </div>
      </HelpPanel>
    </div>
  );
}
