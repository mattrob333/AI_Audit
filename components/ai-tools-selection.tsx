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
  const handleToggle = (toolId: string) => {
    const newSelected = selected.includes(toolId)
      ? selected.filter(id => id !== toolId)
      : [...selected, toolId]
    onSelect(newSelected)
  }

  return (
    <Card className="border border-neutral-800 bg-black">
      <CardHeader className="border-b border-neutral-800">
        <CardTitle className="text-xl font-semibold text-neutral-50">AI Tools You Use or Want to Explore</CardTitle>
        <CardDescription className="text-neutral-400">
          Check any AI solutions you're currently using or curious about. Not sure? Select what you've heard of or skip to let us recommend later.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="rounded-lg border border-neutral-800 bg-black p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aiTools.map(tool => (
              <div
                key={tool.id}
                className="relative flex items-center space-x-2 rounded-lg border border-neutral-800 bg-black/40 p-4"
              >
                <input
                  type="checkbox"
                  id={tool.id}
                  checked={selected.includes(tool.id)}
                  onChange={() => handleToggle(tool.id)}
                  className="h-4 w-4 rounded border-primary text-primary"
                />
                <label
                  htmlFor={tool.id}
                  className="flex flex-1 cursor-pointer items-center justify-between"
                >
                  <span className="text-sm font-medium">{tool.name}</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                      >
                        <Info className="h-4 w-4" />
                        <span className="sr-only">Learn more about {tool.name}</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="start">
                      <p className="max-w-xs">{tool.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
