'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const guides = [
  {
    title: 'Making the Most of Your Data',
    content: 'Consider what data you currently collect and how it could be leveraged. Think about data quality, accessibility, and potential use cases.',
  },
  {
    title: 'Compliance & Security',
    content: 'Ensure your AI implementation plans align with relevant regulations. Consider data privacy, security requirements, and industry standards.',
  },
  {
    title: 'Process Mapping',
    content: 'Identify which processes could benefit most from AI automation. Consider both quick wins and long-term transformational opportunities.',
  },
  {
    title: 'Team Collaboration',
    content: 'Think about how AI tools could enhance team collaboration and workflow efficiency. Consider training needs and change management.',
  },
]

export function HelpGuide({
  className,
}: {
  className?: string
  expanded?: boolean
  onToggle?: () => void
}) {
  return (
    <div
      className={cn(
        'fixed bottom-0 right-0 top-[60px] w-80 border-l border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-2 border-b border-border/40 px-4 py-2">
          <div className="flex-1">
            <h2 className="text-sm font-semibold">AI Audit Guide</h2>
            <p className="text-xs text-muted-foreground">
              Best practices for AI projects
            </p>
          </div>
        </div>
        <ScrollArea className="flex-1 px-4 py-2">
          <Accordion type="single" collapsible className="w-full">
            {guides.map((guide, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-sm">
                  {guide.title}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {guide.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </div>
    </div>
  )
}

