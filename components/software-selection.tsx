'use client'

import * as React from 'react'
import { Search, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const popularSoftware = [
  // Enterprise Software
  { id: 'salesforce', name: 'Salesforce', category: 'CRM' },
  { id: 'hubspot', name: 'HubSpot', category: 'Marketing' },
  { id: 'sap', name: 'SAP', category: 'ERP' },
  { id: 'quickbooks', name: 'QuickBooks', category: 'Finance' },
  { id: 'slack', name: 'Slack', category: 'Communication' },
  { id: 'gsuite', name: 'Google Workspace', category: 'Productivity' },
  { id: 'office365', name: 'Microsoft 365', category: 'Productivity' },
  { id: 'jira', name: 'Jira', category: 'Project Management' },
  { id: 'monday', name: 'Monday.com', category: 'Project Management' },
  { id: 'asana', name: 'Asana', category: 'Task Management' },
  { id: 'clickup', name: 'ClickUp', category: 'Team Collaboration' },
  { id: 'notion', name: 'Notion', category: 'Knowledge Management' },
  { id: 'airtable', name: 'Airtable', category: 'Database Management' },
  { id: 'webex', name: 'Webex', category: 'Video Conferencing' },
  
  // Business Intelligence
  { id: 'tableau', name: 'Tableau', category: 'Business Intelligence' },
  { id: 'powerbi', name: 'Power BI', category: 'Business Intelligence' },
  { id: 'looker', name: 'Looker', category: 'Business Intelligence' },
  { id: 'plusai', name: 'Plus AI', category: 'Business Intelligence' },

  // Process Automation
  { id: 'uipath', name: 'UiPath', category: 'Process Automation' },
  { id: 'automationanywhere', name: 'Automation Anywhere', category: 'Process Automation' },
  { id: 'blueprism', name: 'Blue Prism', category: 'Process Automation' },
  { id: 'bizagi', name: 'Bizagi', category: 'Process Automation' },
  { id: 'nintex', name: 'Nintex Process Platform', category: 'Process Automation' },

  // Industry-Specific
  { id: 'creatio', name: 'Creatio', category: 'CRM Automation' },
  { id: 'sscblueprism', name: 'SS&C Blue Prism', category: 'Enterprise Automation' },
  { id: 'avoma', name: 'Avoma', category: 'Meeting Intelligence' },
  { id: 'fireflies', name: 'Fireflies', category: 'Meeting Transcription' },
  { id: 'suno', name: 'Suno', category: 'AI Music Generation' },

  // HR & Recruitment
  { id: 'textio', name: 'Textio', category: 'Writing Enhancement' },
  { id: 'cvviz', name: 'CVViZ', category: 'Resume Screening' },
  { id: 'paradox', name: 'Paradox', category: 'HR Automation' },
  { id: 'peoplebox', name: 'Peoplebox', category: 'Employee Experience' },

  // Enterprise Search
  { id: 'elastic', name: 'Elastic Enterprise Search', category: 'Enterprise Search' },
  { id: 'watsondiscovery', name: 'IBM Watson Discovery', category: 'Enterprise Search' },
  { id: 'pinecone', name: 'Pinecone', category: 'Enterprise Search' },
  { id: 'lucidworks', name: 'Lucidworks Fusion', category: 'Enterprise Search' },
  { id: 'alphasense', name: 'AlphaSense', category: 'Enterprise Search' },
  { id: 'qatalog', name: 'Qatalog', category: 'Enterprise Search' }
]

export function SoftwareSelection({
  selected,
  onSelect,
}: {
  selected: string[]
  onSelect: (software: string[]) => void
}) {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [customSoftware, setCustomSoftware] = React.useState('')
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const filteredSoftware = React.useMemo(() => {
    return popularSoftware.filter(software =>
      software.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      software.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const handleSelect = (id: string) => {
    if (selected.includes(id)) {
      onSelect(selected.filter(s => s !== id))
    } else {
      onSelect([...selected, id])
    }
  }

  const handleAddCustom = () => {
    if (customSoftware.trim()) {
      const newId = `custom-${customSoftware.toLowerCase().replace(/\s+/g, '-')}`
      popularSoftware.push({
        id: newId,
        name: customSoftware,
        category: 'Custom'
      })
      onSelect([...selected, newId])
      setCustomSoftware('')
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-200 mb-2">Current Software Stack</h2>
        <p className="text-neutral-400">
          Select the software tools your team currently uses. This helps us understand your tech ecosystem.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
            <Input
              placeholder="Search software..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-neutral-800/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-500"
            />
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200">
                <Plus className="mr-2 h-4 w-4" />
                Add Custom
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-neutral-900 border-neutral-800">
              <DialogHeader>
                <DialogTitle className="text-neutral-200">Add Custom Software</DialogTitle>
                <DialogDescription className="text-neutral-400">
                  Enter the name of the software that's not in our list.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-neutral-200">Software Name</Label>
                  <Input
                    id="name"
                    value={customSoftware}
                    onChange={(e) => setCustomSoftware(e.target.value)}
                    placeholder="Enter software name"
                    className="bg-neutral-800/50 border-neutral-700 text-neutral-200 placeholder:text-neutral-500"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-neutral-700 text-neutral-200 hover:bg-neutral-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCustom}
                  disabled={!customSoftware.trim()}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Add Software
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <ScrollArea className="h-[400px] rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
          <div className="grid grid-cols-2 gap-4">
            {filteredSoftware.map((software) => (
              <button
                key={software.id}
                onClick={() => handleSelect(software.id)}
                className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                  selected.includes(software.id)
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500'
                    : 'border-neutral-800 bg-neutral-800/50 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-800 hover:text-neutral-200'
                }`}
              >
                <div className="text-left">
                  <div className="font-medium">{software.name}</div>
                  <div className="text-sm opacity-70">{software.category}</div>
                </div>
                {selected.includes(software.id) && (
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
