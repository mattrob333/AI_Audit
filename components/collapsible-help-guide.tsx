"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CollapsibleHelpGuideProps {
  className?: string
}

export function CollapsibleHelpGuide({ className }: CollapsibleHelpGuideProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <div className="fixed right-0 top-[60px] z-50">
      {/* Green tab */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "absolute -left-8 top-4 h-24 w-8 rounded-l-md bg-green-600 p-0 text-white hover:bg-green-700 transition-transform duration-200",
          isExpanded ? "transform -translate-x-80" : ""
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>

      {/* Main content */}
      <div
        className={cn(
          "absolute right-0 w-80 transform border-l border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-200 h-[calc(100vh-60px)]",
          isExpanded ? "translate-x-0" : "translate-x-full",
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
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Making the Most of Your Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn how to effectively organize and utilize your data for AI projects.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium">Compliance & Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Understand key compliance requirements and security best practices.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium">Process Mapping</h3>
                  <p className="text-sm text-muted-foreground">
                    Map your current processes and identify automation opportunities.
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium">Team Collaboration</h3>
                  <p className="text-sm text-muted-foreground">
                    Best practices for team coordination in AI projects.
                  </p>
                </div>
              </div>
            </Accordion>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
