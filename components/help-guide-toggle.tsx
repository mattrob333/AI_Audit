'use client'

import { Button } from "@/components/ui/button"
import { MessageCircleQuestionIcon as QuestionMarkCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function HelpGuideToggle({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed right-4 top-[76px] z-40">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={onClick}
          >
            <QuestionMarkCircle className="h-4 w-4" />
            <span className="sr-only">Toggle help guide</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          Toggle help guide
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

