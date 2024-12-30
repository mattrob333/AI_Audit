import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Pencil } from 'lucide-react'
import { Button } from './button'
import { Textarea } from './textarea'
import { Card, CardHeader, CardContent } from './card'

interface CollapsibleSectionProps {
  title: string
  content?: string | string[] | Record<string, string[]>
  children?: React.ReactNode
  sectionId?: string
  isExpanded?: boolean
  defaultExpanded?: boolean
  onToggle?: (sectionId: string) => void
  onSave?: (sectionId: string, content: any) => void
}

export function CollapsibleSection({
  title,
  content,
  children,
  sectionId = '',
  isExpanded: controlledIsExpanded,
  defaultExpanded = false,
  onToggle,
  onSave,
}: CollapsibleSectionProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  
  const isExpanded = controlledIsExpanded ?? internalExpanded

  const handleToggle = () => {
    if (onToggle) {
      onToggle(sectionId)
    } else {
      setInternalExpanded(!internalExpanded)
    }
  }

  const handleSave = () => {
    onSave?.(sectionId, editedContent)
    setIsEditing(false)
  }

  const renderContent = () => {
    if (children) {
      return children
    }

    if (isEditing) {
      return (
        <div className="space-y-4">
          {typeof content === 'string' ? (
            <Textarea
              value={editedContent as string}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[200px]"
            />
          ) : Array.isArray(content) ? (
            <Textarea
              value={(editedContent as string[]).join('\n')}
              onChange={(e) => setEditedContent(e.target.value.split('\n'))}
              className="min-h-[200px]"
            />
          ) : (
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(editedContent, null, 2)}
            </pre>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      )
    }

    return typeof content === 'string' ? (
      <p className="whitespace-pre-wrap">{content}</p>
    ) : Array.isArray(content) ? (
      <ul className="list-disc pl-6 space-y-2">
        {content.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    ) : (
      <ul className="list-disc pl-6 space-y-2">
        {Object.entries(content || {}).map(([phase, tasks]) => (
          <li key={phase}>
            <strong>{phase}:</strong>
            <ul className="list-disc pl-6 space-y-1 mt-1">
              {(tasks as string[]).map((task, i) => (
                <li key={i}>{task}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <Card className="mb-4">
      <CardHeader 
        className="cursor-pointer" 
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{title}</h3>
          <div className="flex items-center space-x-2">
            {!isEditing && onSave && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {isExpanded ? (
              <ChevronUp className="h-6 w-6" />
            ) : (
              <ChevronDown className="h-6 w-6" />
            )}
          </div>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          {renderContent()}
        </CardContent>
      )}
    </Card>
  )
}
