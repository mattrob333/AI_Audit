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
  const fileInputRef = React.useRef<HTMLInputElement>(null);
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rows = text.split('\n').map(row => row.trim()).filter(row => row.length > 0);
      const headers = rows[0].toLowerCase().split(',').map(h => h.trim());
      
      const members: TeamMember[] = rows.slice(1).map((row, index) => {
        const values = row.split(',').map(v => v.trim());
        const member: Partial<TeamMember> = {};
        
        headers.forEach((header, i) => {
          if (i >= values.length) return;
          const value = values[i];
          
          switch(header) {
            case 'name':
            case 'role':
            case 'responsibilities':
            case 'email':
              member[header] = value || '';
              break;
          }
        });
        
        return {
          id: (teamMembers.length + index + 1).toString(),
          name: member.name || '',
          role: member.role || '',
          responsibilities: member.responsibilities || '',
          email: member.email || '',
          inviteStatus: 'not_invited',
          details: {}
        };
      });

      setTeamMembers(prev => [...prev, ...members]);
      if (event.target) event.target.value = '';
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Error parsing CSV file. Please make sure it\'s in the correct format.');
    }
  };

  const downloadTemplate = () => {
    const template = [
      ['Name', 'Role', 'Responsibilities', 'Email'].join(','),
      ['John Doe', 'Software Engineer', 'Development of core features', 'john@example.com'].join(',')
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'team_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-200 mb-2">Who's On Your Team?</h2>
        <p className="text-neutral-400">
          Add team members, their roles, and responsibilities. We'll use this to understand your team structure.
        </p>
      </div>

      <div className="rounded-lg border border-neutral-800 overflow-hidden bg-neutral-900/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-neutral-800/50 border-b border-neutral-800">
              <TableHead className="text-neutral-200">Name</TableHead>
              <TableHead className="text-neutral-200">Role/Title</TableHead>
              <TableHead className="text-neutral-200">Responsibilities</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamMembers.map((member) => (
              <TableRow key={member.id} className="hover:bg-neutral-800/50 border-b border-neutral-800">
                <TableCell>
                  <Input
                    placeholder="Full Name"
                    value={member.name}
                    onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                    className="bg-transparent border-0 focus:ring-1 focus:ring-emerald-500/50 text-neutral-200 placeholder:text-neutral-500"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Role/Title"
                    value={member.role}
                    onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                    className="bg-transparent border-0 focus:ring-1 focus:ring-emerald-500/50 text-neutral-200 placeholder:text-neutral-500"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    placeholder="Key responsibilities"
                    value={member.responsibilities}
                    onChange={(e) => updateMember(member.id, 'responsibilities', e.target.value)}
                    className="bg-transparent border-0 focus:ring-1 focus:ring-emerald-500/50 text-neutral-200 placeholder:text-neutral-500"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRow(member.id)}
                    className="text-neutral-400 hover:text-red-400 hover:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={addRow}
          className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Team Member
        </Button>
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="default"
            onClick={() => fileInputRef.current?.click()}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload CSV
          </Button>
          <Button
            variant="outline"
            size="default"
            onClick={downloadTemplate}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
          >
            <Download className="mr-2 h-4 w-4" />
            Template CSV
          </Button>
        </div>
      </div>
    </div>
  )
}
