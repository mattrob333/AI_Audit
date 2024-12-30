import React from 'react';
import { cn } from '@/lib/utils';

interface DocumentCardProps {
  title: string;
  description: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function DocumentCard({ title, description, isSelected, onClick }: DocumentCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'p-6 rounded-lg border-2 cursor-pointer transition-all duration-200',
        'hover:border-primary/50 hover:bg-primary/5',
        isSelected ? 'border-primary bg-primary/10' : 'border-border bg-card'
      )}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
