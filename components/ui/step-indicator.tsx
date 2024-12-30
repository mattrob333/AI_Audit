import React from 'react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  completed?: boolean;
  active?: boolean;
}

export function StepIndicator({ completed, active }: StepIndicatorProps) {
  return (
    <div
      className={cn(
        'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
        completed ? 'bg-primary border-primary' : 'border-muted-foreground',
        active ? 'border-primary' : '',
        active && !completed ? 'bg-background' : ''
      )}
    >
      {completed && (
        <div className="w-2 h-2 rounded-full bg-background" />
      )}
    </div>
  );
}
