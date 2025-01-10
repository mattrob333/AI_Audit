'use client';

import { LongTermOpportunity } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Target, TrendingUp } from 'lucide-react';

interface LongTermCardProps {
  opportunity: LongTermOpportunity;
}

export function LongTermCard({ opportunity }: LongTermCardProps) {
  const strategicValueColor = {
    High: 'text-blue-500',
    'Very High': 'text-purple-500',
    Transformative: 'text-indigo-500'
  }[opportunity.strategicValue];

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-purple-100 p-2">
            <Target className="h-4 w-4 text-purple-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold mb-2">{opportunity.description}</h4>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Timeline: <span className="font-medium text-foreground">{opportunity.timeHorizon}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>ROI: <span className="font-medium text-foreground">{opportunity.roiPotential}</span></span>
              </div>
              <div className="mt-2">
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${strategicValueColor} bg-opacity-10`}>
                  {opportunity.strategicValue} Impact
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
