'use client';

import { cn } from '@/lib/utils';
import { DocumentType } from '@/lib/documents';

interface DocumentStep {
  id: DocumentType;
  title: string;
  description: string;
}

interface DocumentStepsProps {
  steps: DocumentStep[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export function DocumentSteps({ steps, currentStep, onStepClick, className }: DocumentStepsProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <button
            key={step.id}
            onClick={() => onStepClick?.(index)}
            className={cn(
              'w-full px-4 py-3 text-left transition-colors rounded-lg',
              'hover:bg-accent/50',
              isActive && 'bg-accent',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
            )}
          >
            <div className="flex items-start gap-4">
              <div className="relative flex items-center justify-center mt-1">
                <div
                  className={cn(
                    'w-4 h-4 rounded-full border-2 transition-colors',
                    isCompleted ? 'border-primary bg-primary' : 'border-muted-foreground',
                    isActive && !isCompleted && 'border-primary'
                  )}
                >
                  {isCompleted && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-background" />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 
                  className={cn(
                    'text-sm font-medium truncate',
                    isCompleted || isActive ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </h3>
                <p 
                  className={cn(
                    'text-xs truncate',
                    isCompleted || isActive ? 'text-muted-foreground' : 'text-muted-foreground/60'
                  )}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
