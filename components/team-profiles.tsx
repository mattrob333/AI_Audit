'use client'

import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Plus, Trash2, ChevronRight, Upload, Download } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Link } from "@/components/ui/link"

interface TeamMember {
  id: string;
  name: string;
  role: string;
  responsibilities: string;
  email: string;
  inviteStatus: 'not_invited' | 'invited' | 'completed';
  details?: {
    department?: string;
    reportsTo?: string;
    enneagramType?: {
      value: string;
      label: string;
    }
    aiSkills?: string[] // Array of selected AI skill areas
  }
}

const enneagramTypes = [
  { value: '1', label: 'Type 1 - The Reformer' },
  { value: '2', label: 'Type 2 - The Helper' },
  { value: '3', label: 'Type 3 - The Achiever' },
  { value: '4', label: 'Type 4 - The Individualist' },
  { value: '5', label: 'Type 5 - The Investigator' },
  { value: '6', label: 'Type 6 - The Loyalist' },
  { value: '7', label: 'Type 7 - The Enthusiast' },
  { value: '8', label: 'Type 8 - The Challenger' },
  { value: '9', label: 'Type 9 - The Peacemaker' },
]

const aiSkillOptions = [
  'Copywriting',
  'Planning & Coordination',
  'Marketing Campaigns',
  'Sales Call Scripts',
  'Data Analysis',
  'Presentation Design',
  'Content Creation',
  'Customer Engagement',
  'Workflow Optimization',
  'Problem-Solving'
]

type DetailsValue = 
  | string
  | string[]
  | { value: string; label: string }
  | undefined;

export function TeamProfiles({
  teamMembers: externalTeamMembers = [],
  onTeamMembersChange
}: {
  teamMembers: TeamMember[]
  onTeamMembersChange: (members: TeamMember[]) => void
}) {
  const [teamMembers, setTeamMembers] = React.useState<TeamMember[]>((externalTeamMembers?.length ? externalTeamMembers : [
    {
      id: '1',
      name: '',
      role: '',
      responsibilities: '',
      email: '',
      inviteStatus: 'not_invited',
      details: {}
    },
    {
      id: '2',
      name: '',
      role: '',
      responsibilities: '',
      email: '',
      inviteStatus: 'not_invited',
      details: {}
    }
  ]))

  React.useEffect(() => {
    onTeamMembersChange(teamMembers)
  }, [teamMembers, onTeamMembersChange])

  const addRow = () => {
    const newId = (teamMembers.length + 1).toString()
    setTeamMembers(prev => [...prev, {
      id: newId,
      name: '',
      role: '',
      responsibilities: '',
      email: '',
      inviteStatus: 'not_invited',
      details: {}
    }])
  }

  const removeRow = (id: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id))
  }

  const updateMember = (id: string, field: keyof TeamMember, value: string) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ))
  }

  const updateMemberDetails = (id: string, field: string, value: DetailsValue) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === id ? {
        ...member,
        details: {
          ...member.details,
          [field]: value
        }
      } : member
    ))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const rows = text.split('\n')
          .slice(1) // Skip header
          .filter(row => row.trim()) // Skip empty rows
          .map(row => {
            // Split CSV line properly handling quoted fields and spaces
            const values = row.match(/(?:^|,)(?:"([^"]*)"|([^,"]*))/g)?.map(value => {
              // Remove leading comma if present and any surrounding quotes
              return value.replace(/^,/, '').replace(/^"|"$/g, '').trim();
            }) || []
            const [
              name = '',
              role = '',
              responsibilities = '',
              email = '',
              department = '',
              reportsTo = '',
              enneagramType = ''
            ] = values

            if (name || role || responsibilities) {
              return {
                id: crypto.randomUUID(),
                name,
                role,
                responsibilities,
                email,
                inviteStatus: 'not_invited' as const,
                details: {
                  department,
                  reportsTo,
                  enneagramType: enneagramType ? {
                    value: enneagramType,
                    label: enneagramType
                  } : undefined,
                  aiSkills: []
                }
              }
            }
            return null
          })
          .filter(Boolean) as TeamMember[]

        // Replace existing team members instead of appending
        setTeamMembers(rows)
      }
      reader.readAsText(file)
    }
    // Reset the input so the same file can be uploaded again if needed
    event.target.value = ''
  }

  return (
    <Card className="border border-neutral-800 bg-black">
      <CardHeader className="border-b border-neutral-800">
        <CardTitle className="text-xl font-semibold text-neutral-50">Who's On Your Team?</CardTitle>
        <CardDescription className="text-neutral-400">
          Add team members, their roles, and responsibilities. We'll use this to understand your team structure.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="rounded-md border border-neutral-800 bg-black/40">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-950">
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead className="w-[250px]">Role/Title</TableHead>
                  <TableHead className="w-[400px]">Responsibilities</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member, index) => (
                  <TableRow key={member.id} className="group">
                    <TableCell>
                      <Input
                        placeholder="Full Name"
                        value={member.name}
                        onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                        className="bg-neutral-950 border-neutral-800 text-neutral-200 placeholder:text-neutral-500"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Role/Title"
                        value={member.role}
                        onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                        className="bg-neutral-950 border-neutral-800 text-neutral-200 placeholder:text-neutral-500"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Key responsibilities"
                        value={member.responsibilities}
                        onChange={(e) => updateMember(member.id, 'responsibilities', e.target.value)}
                        className="bg-neutral-950 border-neutral-800 text-neutral-200 placeholder:text-neutral-500"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeRow(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Collapsible>
            <CollapsibleTrigger asChild>
              <div className="flex items-center space-x-4 cursor-pointer py-2">
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4 mr-2" />
                  Additional Details
                </Button>
                <div className="h-px flex-1 bg-border"></div>
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-6 pt-4">
                {teamMembers.map((member, index) => (
                  <div key={`${member.id}-details`} className="rounded-lg border border-neutral-800 bg-black/40 p-6">
                    <h3 className="text-lg font-semibold text-neutral-50">{member.name || `Team Member ${index + 1}`}</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Email address"
                            value={member.email}
                            onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                            className="bg-neutral-950 border-neutral-800 text-neutral-200 placeholder:text-neutral-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Department</Label>
                        <Input
                          placeholder="e.g., Engineering, Marketing, Sales"
                          value={member.details?.department || ''}
                          onChange={(e) => updateMemberDetails(member.id, 'department', e.target.value)}
                          className="bg-neutral-950 border-neutral-800 text-neutral-200 placeholder:text-neutral-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Reports To</Label>
                        <Input
                          placeholder="Manager or Supervisor"
                          value={member.details?.reportsTo || ''}
                          onChange={(e) => updateMemberDetails(member.id, 'reportsTo', e.target.value)}
                          className="bg-neutral-950 border-neutral-800 text-neutral-200 placeholder:text-neutral-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Enneagram Type</Label>
                          <Link
                            href="https://www.enneagraminstitute.com/type-descriptions"
                            target="_blank"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            Find Your Type
                          </Link>
                        </div>
                        <Select
                          value={member.details?.enneagramType?.value || ''}
                          onValueChange={(value) => {
                            if (!value) {
                              updateMemberDetails(member.id, 'enneagramType', undefined);
                              return;
                            }
                            const selectedType = enneagramTypes.find(type => type.value === value);
                            if (selectedType) {
                              updateMemberDetails(member.id, 'enneagramType', {
                                value: selectedType.value,
                                label: selectedType.label
                              });
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your Enneagram type (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {enneagramTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-lg font-semibold text-neutral-50">Upskill with AI Tools and Training</Label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Select the areas where you'd like to enhance your skills with the help of AI-powered tools and personalized training. 
                            This will guide us in tailoring AI solutions and resources to support your growth.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {aiSkillOptions.map((skill) => (
                            <div key={skill} className="flex items-center space-x-2">
                              <Checkbox
                                id={`skill-${skill}`}
                                checked={member.details?.aiSkills?.includes(skill) || false}
                                onCheckedChange={(checked) => {
                                  const currentSkills = member.details?.aiSkills || []
                                  const newSkills = checked
                                    ? [...currentSkills, skill]
                                    : currentSkills.filter((s) => s !== skill)
                                  updateMemberDetails(member.id, 'aiSkills', newSkills)
                                }}
                              />
                              <Label htmlFor={`skill-${skill}`} className="text-sm">
                                {skill}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="flex gap-4 mt-4">
            <Button variant="default" onClick={addRow}>
              <Plus className="mr-2 h-4 w-4" /> Add Team Member
            </Button>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept=".csv"
                className="hidden"
                id="csvUpload"
                onChange={handleFileUpload}
              />
              <Button variant="outline" onClick={() => document.getElementById('csvUpload')?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Upload CSV
              </Button>
              <a href="/team-members-template.csv" download>
                <Button variant="ghost" size="sm">
                  <Download className="mr-2 h-4 w-4" /> Template CSV
                </Button>
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
