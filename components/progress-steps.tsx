'use client'

import { cn } from '@/lib/utils'

const steps = [
  { number: 1, label: 'Business Overview' },
  { number: 2, label: 'Team & Technology' },
  { number: 3, label: 'Process & Performance Audit' },
  { number: 4, label: 'AI Recommendations' },
  { number: 5, label: 'Final Documents & Implementation Plan' },
]

export function ProgressSteps({
  currentStep,
  variant = 'horizontal',
  className,
}: {
  currentStep: number
  variant?: 'horizontal' | 'vertical'
  className?: string
}) {
  return (
    <nav 
      className={cn(
        'bg-black',
        variant === 'horizontal' && 'w-full',
        variant === 'vertical' && 'h-full py-2',
        className
      )}
    >
      <ol 
        className={cn(
          variant === 'horizontal' && 'flex divide-x divide-neutral-800',
          variant === 'vertical' && 'flex flex-col space-y-1'
        )}
      >
        {steps.map((step) => {
          const isCompleted = step.number < currentStep
          const isCurrent = step.number === currentStep
          
          return (
            <li
              key={step.number}
              className={cn(
                'relative',
                variant === 'horizontal' && 'flex-1',
                variant === 'vertical' && 'px-4 py-2',
                variant === 'vertical' && isCompleted && 'bg-emerald-500/10',
                variant === 'vertical' && isCurrent && 'bg-emerald-500/20',
                variant === 'vertical' && !isCompleted && !isCurrent && 'hover:bg-neutral-800/20'
              )}
            >
              <div 
                className={cn(
                  'flex items-center text-sm',
                  variant === 'horizontal' && 'justify-center px-4 py-3',
                  variant === 'vertical' && 'justify-start'
                )}
              >
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs',
                    isCompleted && 'bg-emerald-500 text-neutral-900',
                    isCurrent && 'bg-emerald-500 text-neutral-900',
                    !isCompleted && !isCurrent && 'bg-neutral-800/50 text-neutral-500'
                  )}
                >
                  {step.number}
                </span>
                <span
                  className={cn(
                    'ml-3 whitespace-nowrap font-medium',
                    isCompleted && 'text-emerald-500',
                    isCurrent && 'text-emerald-500',
                    !isCompleted && !isCurrent && 'text-neutral-500'
                  )}
                >
                  {step.label}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
