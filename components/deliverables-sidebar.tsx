'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export type Deliverable = {
  id: string
  name: string
  price: number
  description: string
  details: string[]
}

const deliverables: Deliverable[] = [
  {
    id: 'training',
    name: 'Custom Team Upskill Training Docs',
    price: 100,
    description: 'A series of documents and workshop materials to guide your team through AI best practices. Great for a 3-day seminar or Zoom training.',
    details: [
      'AI fundamentals and best practices',
      'Implementation examples and case studies',
      'Team adoption strategies and tips',
      'Hands-on exercises and workshops'
    ]
  },
  {
    id: 'assistants',
    name: 'Custom AI Assistants',
    price: 100,
    description: 'Internal marketing, sales, or ops bots that streamline daily tasks using your team\'s knowledge base.',
    details: [
      'Marketing content generation',
      'Sales pipeline automation',
      'Operations workflow optimization',
      'Internal knowledge base integration'
    ]
  },
  {
    id: 'chatbots',
    name: 'Custom Chatbots',
    price: 100,
    description: 'Customer-facing bots for common support queries, integrated with your existing knowledge base.',
    details: [
      'Customer support automation',
      'FAQ handling and responses',
      'Knowledge base integration',
      'Multi-channel deployment'
    ]
  },
  {
    id: 'automations',
    name: 'Software Automations',
    price: 100,
    description: 'Automate repetitive tasks like email outreach, scheduling, or notifications, saving hours each week.',
    details: [
      'Email automation workflows',
      'Task scheduling and reminders',
      'Notification systems',
      'Process optimization'
    ]
  },
  {
    id: 'summary',
    name: 'Executive Summary',
    price: 100,
    description: 'A concise, executive-level overview highlighting recommended AI approaches, cost/time savings, and potential ROI.',
    details: [
      'Strategic recommendations',
      'Cost-benefit analysis',
      'Implementation timeline',
      'ROI projections'
    ]
  }
]

type DeliverablesSidebarProps = {
  selected: string[]
  onSelect: (ids: string[]) => void
  onPreview: (deliverable: Deliverable) => void
  fullPackage: boolean
  onFullPackageChange: (value: boolean) => void
}

export function DeliverablesSidebar({
  selected,
  onSelect,
  onPreview,
  fullPackage,
  onFullPackageChange,
}: DeliverablesSidebarProps) {
  const handleItemSelect = (id: string, checked: boolean) => {
    if (fullPackage) return
    
    const newSelected = checked
      ? [...selected, id]
      : selected.filter(item => item !== id)
    onSelect(newSelected)
  }

  const handleFullPackageSelect = (checked: boolean) => {
    onFullPackageChange(checked)
    if (checked) {
      onSelect(deliverables.map(d => d.id))
    } else {
      onSelect([])
    }
  }

  return (
    <div className="w-80 border-r border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-border/40 px-4 py-2">
          <h2 className="text-sm font-semibold">Select Deliverables</h2>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {deliverables.map((deliverable) => (
              <div
                key={deliverable.id}
                className={cn(
                  'flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50',
                  selected.includes(deliverable.id) && 'border-primary'
                )}
                onClick={() => onPreview(deliverable)}
              >
                <Checkbox
                  id={deliverable.id}
                  checked={selected.includes(deliverable.id)}
                  onCheckedChange={(checked) =>
                    handleItemSelect(deliverable.id, checked === true)
                  }
                  disabled={fullPackage}
                />
                <div className="flex-1">
                  <Label
                    htmlFor={deliverable.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {deliverable.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    ${deliverable.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="my-4 border-t" />
          <div
            className={cn(
              'flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50',
              fullPackage && 'border-primary'
            )}
          >
            <Checkbox
              id="full-package"
              checked={fullPackage}
              onCheckedChange={(checked) =>
                handleFullPackageSelect(checked === true)
              }
            />
            <div className="flex-1">
              <Label
                htmlFor="full-package"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Full Package
              </Label>
              <p className="text-sm text-muted-foreground">
                $1000 (includes 3-day training)
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-border/40 p-4">
          <div className="flex justify-between mb-4">
            <span className="font-medium">Total:</span>
            <span className="font-medium">
              ${fullPackage ? 1000 : selected.length * 100}
            </span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="w-full" disabled={selected.length === 0}>
                Generate Documents
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {selected.length === 0
                ? 'Select at least one deliverable'
                : 'Proceed to document generation'}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

