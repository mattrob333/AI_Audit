'use client'

import { cn } from '@/lib/utils'

const steps = [
  { id: 1, name: 'Business Details', href: '/' },
  { id: 2, name: 'Team & Software', href: '/step-2' },
  { id: 3, name: 'Company Audit', href: '/step-3' },
  { id: 4, name: 'Recommendations', href: '/step-4' },
  { id: 5, name: 'Final Review', href: '/step-5' }
]

export function ProgressSteps({ currentStep = 1 }: { currentStep?: number }) {
  return (
    <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ol
        role="list"
        className="flex min-h-[60px] items-center gap-2 px-4 text-sm font-medium"
      >
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={cn(
              stepIdx !== steps.length - 1 ? 'flex-1' : '',
              'flex items-center gap-2'
            )}
          >
            <div
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs',
                step.id < currentStep
                  ? 'border-primary bg-primary text-primary-foreground'
                  : step.id === currentStep
                  ? 'border-primary text-primary'
                  : 'border-muted-foreground/30 text-muted-foreground/30'
              )}
            >
              {step.id < currentStep ? '✓' : step.id}
            </div>
            <span
              className={cn(
                'hidden sm:block',
                step.id < currentStep
                  ? 'text-foreground'
                  : step.id === currentStep
                  ? 'text-foreground'
                  : 'text-muted-foreground/30'
              )}
            >
              {step.name}
            </span>
            {stepIdx !== steps.length - 1 ? (
              <div
                className={cn(
                  'h-[2px] flex-1',
                  step.id < currentStep
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30'
                )}
              />
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}

