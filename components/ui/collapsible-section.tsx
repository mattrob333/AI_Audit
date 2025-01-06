import React, { useState } from 'react'
import { ChevronDown, ChevronUp, Pencil } from 'lucide-react'
import { Button } from './button'
import { Textarea } from './textarea'

interface CollapsibleSectionProps {
  title: string
  content?: string | string[] | Record<string, string[]>
  children?: React.ReactNode
  sectionId?: string
  isExpanded?: boolean
  defaultExpanded?: boolean
  onToggle?: (sectionId: string) => void
  onSave?: (sectionId: string, content: any) => void
  className?: string
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
  className,
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
              className="min-h-[200px] bg-neutral-800 border-neutral-700 text-neutral-50"
            />
          ) : Array.isArray(content) ? (
            <Textarea
              value={(editedContent as string[]).join('\n')}
              onChange={(e) => setEditedContent(e.target.value.split('\n'))}
              className="min-h-[200px] bg-neutral-800 border-neutral-700 text-neutral-50"
            />
          ) : (
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(editedContent, null, 2)}
            </pre>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="text-neutral-400 hover:text-neutral-50 border-neutral-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-emerald-500 hover:bg-emerald-600 text-neutral-900"
            >
              Save Changes
            </Button>
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
    <div className={['rounded-lg border border-neutral-800 bg-neutral-900/50 overflow-hidden', className].join(' ')}>
      <div 
        className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-neutral-800/50"
        onClick={handleToggle}
      >
        <h3 className="text-lg font-medium text-neutral-50">{title}</h3>
        <div className="flex items-center space-x-2">
          {!isEditing && onSave && (
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-400 hover:text-neutral-50"
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-neutral-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-neutral-400" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-6 py-4 border-t border-neutral-800">
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={typeof editedContent === 'string' ? editedContent : JSON.stringify(editedContent, null, 2)}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[200px] bg-neutral-800 border-neutral-700 text-neutral-50"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="text-neutral-400 hover:text-neutral-50 border-neutral-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-emerald-500 hover:bg-emerald-600 text-neutral-900"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-neutral-300">
              {renderContent()}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
