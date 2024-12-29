'use client'

import * as React from 'react'
import { ChevronDown, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useRouter } from 'next/navigation'

type InputSummaryProps = {
  businessDetails: {
    name: string
    overview: string
    challenges: string[]
    editLink: string
  }
  teamAndSoftware: {
    departments: Array<{
      name: string
      employees: string
      skillLevel: string
    }>
    software: string[]
    aiTools: string[]
    editLink: string
  }
  auditHighlights: {
    highlights: string[]
    editLink: string
  }
}

export function InputSummary({ businessDetails, teamAndSoftware, auditHighlights }: InputSummaryProps) {
  const router = useRouter()

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="business">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center justify-between w-full">
            Business Details
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={(e) => {
                e.stopPropagation()
                router.push(businessDetails.editLink)
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <h4 className="font-medium">Business Name</h4>
            <p className="text-muted-foreground">{businessDetails.name}</p>
          </div>
          <div>
            <h4 className="font-medium">Overview</h4>
            <p className="text-muted-foreground">{businessDetails.overview}</p>
          </div>
          <div>
            <h4 className="font-medium">Key Challenges</h4>
            <ul className="list-disc pl-4 text-muted-foreground">
              {businessDetails.challenges.map((challenge, i) => (
                <li key={i}>{challenge}</li>
              ))}
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="team">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center justify-between w-full">
            Team & Software
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={(e) => {
                e.stopPropagation()
                router.push(teamAndSoftware.editLink)
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </AccordionTrigger>
        <AccordionContent className="space-y-4">
          <div>
            <h4 className="font-medium">Departments & Roles</h4>
            <div className="space-y-2">
              {teamAndSoftware.departments.map((dept, i) => (
                <div key={i} className="rounded-md border p-3">
                  <p className="font-medium">{dept.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {dept.employees} employees • {dept.skillLevel} AI readiness
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium">Current Software Stack</h4>
            <div className="flex flex-wrap gap-2">
              {teamAndSoftware.software.map((software, i) => (
                <span
                  key={i}
                  className="rounded-full bg-secondary px-3 py-1 text-sm"
                >
                  {software}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium">AI Tools Selected</h4>
            <div className="flex flex-wrap gap-2">
              {teamAndSoftware.aiTools.map((tool, i) => (
                <span
                  key={i}
                  className="rounded-full bg-secondary px-3 py-1 text-sm"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="audit">
        <AccordionTrigger className="text-lg font-semibold">
          <div className="flex items-center justify-between w-full">
            Company Audit Highlights
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={(e) => {
                e.stopPropagation()
                router.push(auditHighlights.editLink)
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
            {auditHighlights.highlights.map((highlight, i) => (
              <li key={i}>{highlight}</li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

