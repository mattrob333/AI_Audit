'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight } from 'lucide-react';

interface Question {
  id: number;
  text: string;
}

const auditQuestions: Question[] = [
  {
    id: 1,
    text: 'What are the current workflows in place for various processes such as IT management, vendor selection, contract negotiation, and project management?'
  },
  {
    id: 2,
    text: 'What are the key pain points or bottlenecks in these workflows, and what has been done previously to address them?'
  },
  {
    id: 3,
    text: 'What is the team\'s current level of familiarity and skill with AI and related technologies?'
  },
  {
    id: 4,
    text: 'Does the team feel prepared and equipped to integrate and maintain AI solutions into their current operations?'
  },
  {
    id: 5,
    text: 'What sort of existing technology infrastructure does the company have in place?'
  }
];

interface CompanyAuditProps {
  answers: { [key: number]: string };
  onAnswerChange: (questionId: number, answer: string) => void;
  onNext: () => void;
}

export function CompanyAudit({ answers, onAnswerChange, onNext }: CompanyAuditProps) {
  return (
    <div className="space-y-6">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-50 mb-3">
          Company Audit
        </h1>
        <p className="text-lg text-neutral-400">
          Answer these questions to help us tailor your AI integration plan.
        </p>
      </div>

      <div className="bg-neutral-900/50 rounded-xl border border-neutral-800/50 backdrop-blur-sm p-8 space-y-8">
        <div className="border border-yellow-600/20 bg-yellow-500/10 rounded-lg p-4 mb-8">
          <p className="text-sm text-yellow-200/80">
            All questions must be answered before proceeding
          </p>
        </div>

        {auditQuestions.map((question) => (
          <div key={question.id} className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <label
                htmlFor={`question-${question.id}`}
                className="text-base font-medium text-neutral-200"
              >
                {question.id}. {question.text}
              </label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {}}
                className="shrink-0 text-neutral-400 hover:text-neutral-300"
              >
                Skip
              </Button>
            </div>
            <div className="relative">
              <Textarea
                id={`question-${question.id}`}
                value={answers[question.id] || ''}
                onChange={(e) => onAnswerChange(question.id, e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[100px] bg-neutral-800/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-500 resize-none"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-3 bottom-3 text-neutral-400 hover:text-neutral-300"
              >
                AI Answer
              </Button>
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <Button
            onClick={onNext}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium"
          >
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
