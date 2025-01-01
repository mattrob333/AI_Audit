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
  const [customSoftware, setCustomSoftware] = React.useState<string[]>([])
  const [searchQuery, setSearchQuery] = React.useState('')
  const [newSoftware, setNewSoftware] = React.useState('')

  const filteredSoftware = popularSoftware.filter(
    software =>
      software.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      software.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleToggle = (softwareId: string) => {
    const newSelected = selected.includes(softwareId)
      ? selected.filter(id => id !== softwareId)
      : [...selected, softwareId]
    onSelect(newSelected)
  }

  const handleAddCustom = () => {
    if (newSoftware.trim()) {
      setCustomSoftware(prev => [...prev, newSoftware.trim()])
      onSelect([...selected, newSoftware.trim()])
      setNewSoftware('')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Existing Software Stack</CardTitle>
        <CardDescription>
          Choose from popular enterprise tools or add custom solutions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search software..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Custom
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Software</DialogTitle>
                <DialogDescription>
                  Enter the name of the software you use that isn't listed.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Software name</Label>
                  <Input
                    id="name"
                    value={newSoftware}
                    onChange={e => setNewSoftware(e.target.value)}
                    placeholder="Enter software name"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddCustom}>Add Software</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <ScrollArea className="h-[300px] rounded-md border">
          <div className="p-4">
            {filteredSoftware.map(software => (
              <div
                key={software.id}
                className="flex items-center space-x-2 py-2"
              >
                <input
                  type="checkbox"
                  id={software.id}
                  checked={selected.includes(software.id)}
                  onChange={() => handleToggle(software.id)}
                  className="h-4 w-4 rounded border-primary text-primary"
                />
                <Label
                  htmlFor={software.id}
                  className="flex-1 cursor-pointer text-sm"
                >
                  {software.name}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {software.category}
                  </span>
                </Label>
              </div>
            ))}
            {customSoftware.map(software => (
              <div key={software} className="flex items-center space-x-2 py-2">
                <input
                  type="checkbox"
                  id={software}
                  checked={selected.includes(software)}
                  onChange={() => handleToggle(software)}
                  className="h-4 w-4 rounded border-primary text-primary"
                />
                <Label
                  htmlFor={software}
                  className="flex-1 cursor-pointer text-sm"
                >
                  {software}
                  <span className="ml-2 text-xs text-muted-foreground">
                    Custom
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
