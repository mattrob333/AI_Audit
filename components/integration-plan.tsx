'use client'

import * as React from 'react'
import { Pencil, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type PlanSection = {
  id: string
  title: string
  content: string
}

type IntegrationPlanProps = {
  sections: PlanSection[]
  onUpdate: (sections: PlanSection[]) => void
}

export function IntegrationPlan({ sections, onUpdate }: IntegrationPlanProps) {
  const [editingSection, setEditingSection] = React.useState<string | null>(null)

  const handleEdit = (id: string) => {
    setEditingSection(id)
  }

  const handleSave = (id: string, newContent: string) => {
    const updatedSections = sections.map(section =>
      section.id === id ? { ...section, content: newContent } : section
    )
    onUpdate(updatedSections)
    setEditingSection(null)
  }

  const handleAIRefine = (id: string) => {
    // This would eventually call an AI service to refine the content
    console.log('AI Refine requested for section', id)
  }

  return (
    <div className="space-y-6">
      {sections.map(section => (
        <Card key={section.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{section.title}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(section.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAIRefine(section.id)}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Refine
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {editingSection === section.id ? (
              <div className="space-y-2">
                <Textarea
                  defaultValue={section.content}
                  className="min-h-[100px]"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingSection(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSave(section.id, section.content)}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{section.content}</div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

