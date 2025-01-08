'use client'

import * as React from 'react'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const aiTools = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'Ideal for text generation, customer support automation, and content creation',
  },
  {
    id: 'claude',
    name: 'Claude AI',
    description: 'Advanced language model for complex analysis and code assistance',
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'AI-powered image generation for design and creative work',
  },
  {
    id: 'bard',
    name: 'Google Bard',
    description: 'Versatile AI for research, writing, and problem-solving',
  },
  {
    id: 'dalle',
    name: 'DALL-E',
    description: 'Creates images from textual descriptions',
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'AI pair programmer for code suggestions and automation',
  },
]

export function AIToolsSelection({
  selected,
  onSelect,
}: {
  selected: string[]
  onSelect: (tools: string[]) => void
}) {
  const handleSelect = (toolId: string) => {
    const newSelected = selected.includes(toolId)
      ? selected.filter(id => id !== toolId)
      : [...selected, toolId]
    onSelect(newSelected)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-200 mb-2">AI Tools Experience</h2>
        <p className="text-neutral-400">
          Select AI tools you're currently using or interested in exploring. This helps us understand your AI readiness.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aiTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleSelect(tool.id)}
            className={`flex flex-col rounded-lg border p-4 transition-colors ${
              selected.includes(tool.id)
                ? 'border-emerald-500/50 bg-emerald-500/10'
                : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-800'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium ${
                selected.includes(tool.id) ? 'text-emerald-500' : 'text-neutral-200'
              }`}>
                {tool.name}
              </span>
              {selected.includes(tool.id) && (
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
              )}
            </div>
            <p className={`text-sm ${
              selected.includes(tool.id) ? 'text-emerald-500/70' : 'text-neutral-400'
            }`}>
              {tool.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
