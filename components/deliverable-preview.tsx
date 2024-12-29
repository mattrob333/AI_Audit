'use client'

import { Check } from 'lucide-react'
import type { Deliverable } from './deliverables-sidebar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type DeliverablePreviewProps = {
  deliverable: Deliverable | null
  isSelected: boolean
  isFullPackage: boolean
  onSelect: (id: string, selected: boolean) => void
}

export function DeliverablePreview({
  deliverable,
  isSelected,
  isFullPackage,
  onSelect,
}: DeliverablePreviewProps) {
  if (!deliverable) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Select a deliverable to see details
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{deliverable.name}</CardTitle>
        <CardDescription>
          {isFullPackage
            ? 'Included in Full Package'
            : `$${deliverable.price}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">{deliverable.description}</p>
        <div className="space-y-2">
          <h4 className="font-medium">Includes:</h4>
          <ul className="space-y-2">
            {deliverable.details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 mt-1 text-primary" />
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
        {!isFullPackage && (
          <Button
            className="w-full"
            variant={isSelected ? 'secondary' : 'default'}
            onClick={() => onSelect(deliverable.id, !isSelected)}
          >
            {isSelected ? 'Remove from Selection' : 'Add to Selection'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

