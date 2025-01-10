'use client';

import { QuickWin } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Clock, TrendingUp } from 'lucide-react';

interface QuickWinCardProps {
  quickWin: QuickWin;
}

export function QuickWinCard({ quickWin }: QuickWinCardProps) {
  const complexityColor = {
    Low: 'text-green-500',
    Medium: 'text-yellow-500',
    High: 'text-red-500'
  }[quickWin.implementationComplexity];

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-blue-100 p-2">
            <Zap className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-2">{quickWin.description}</h4>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Time Saved: <span className="font-medium text-foreground">{quickWin.estimatedTimeSavedPerWeek}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>ROI: <span className="font-medium text-foreground">{quickWin.roiPotential}</span></span>
              </div>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${complexityColor} bg-opacity-10`}>
                  {quickWin.implementationComplexity} Complexity
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
