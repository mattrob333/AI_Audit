'use client'

import * as React from 'react'
import { Mic, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const suggestions = ['Industry & Market', 'Existing Processes', 'Software / Tooling', 'Challenges / Goals']

export function ProjectForm({ onNext }: { onNext: () => void }) {
  const [description, setDescription] = React.useState('')
  const [businessName, setBusinessName] = React.useState('')
  const [enhancing, setEnhancing] = React.useState(false)

  const addSuggestion = (suggestion: string) => {
    setDescription(prev => {
      const newText = `${suggestion}:
- `
      return prev ? `${prev}

${newText}` : newText
    })
  }

  const enhanceDescription = async () => {
    if (!description.trim()) return
    
    setEnhancing(true)
    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: "Please provide a comprehensive business overview",
          answer: description
        }),
      })

      const data = await response.json()
      if (data.enhancedAnswer) {
        setDescription(data.enhancedAnswer)
      }
    } catch (error) {
      console.error('Error enhancing description:', error)
    } finally {
      setEnhancing(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const businessDetails = {
      businessName,
      description
    }
    localStorage.setItem('businessDetails', JSON.stringify(businessDetails))
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl py-8">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Start Your AI Integration Audit
        </h1>
        <p className="text-lg text-muted-foreground">
          Tell us about your business so we can uncover AI-driven opportunities and tailor your personalized plan.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <Label htmlFor="businessName" className="text-base">Business Name</Label>
          <Input
            id="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g., Acme Logistics Inc. or Tech Solutions LLC"
            required
          />
        </div>

        <div className="space-y-4">
          <Label htmlFor="businessOverview" className="text-base">Business Overview</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {suggestions.map(suggestion => (
              <Button
                key={suggestion}
                variant="secondary"
                size="sm"
                onClick={() => addSuggestion(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
          <div className="relative">
            <Textarea
              id="businessOverview"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Include details like market/industry, products/services offered, current size (number of employees), revenue range, or any core challenges you're facing."
              className="min-h-[200px] resize-y"
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Mic className="h-4 w-4" />
                    <span className="sr-only">Voice input</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Record your description by voice</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    type="button"
                    disabled={enhancing || !description.trim()}
                    onClick={enhanceDescription}
                  >
                    <Wand2 className={cn("h-4 w-4", enhancing && "animate-pulse")} />
                    <span className="sr-only">AI refinement</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Enhance your description with AI</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button size="lg" type="submit">Next Step</Button>
        </div>
      </div>
    </form>
  )
}
