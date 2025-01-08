'use client';

import * as React from 'react';
import { Trash2, ChevronDown, ChevronUp, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface TeamMember {
  name: string;
  role: string;
  responsibilities: string;
  email?: string;
  enneagramType?: string;
  department?: string;
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    call: boolean;
    slack: boolean;
  }
}

interface TeamMemberSectionProps {
  teamMembers: TeamMember[];
  onChange: (members: TeamMember[]) => void;
}

export function TeamMemberSection({ teamMembers, onChange }: TeamMemberSectionProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [openStates, setOpenStates] = React.useState<{ [key: number]: boolean }>({});

  const toggleOpen = (index: number) => {
    setOpenStates(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const addTeamMember = () => {
    onChange([...teamMembers, {
      name: '',
      role: '',
      responsibilities: '',
      communicationPreferences: {
        email: false,
        sms: false,
        call: false,
        slack: false
      }
    }]);
  };

  const removeTeamMember = (index: number) => {
    const newMembers = [...teamMembers];
    newMembers.splice(index, 1);
    onChange(newMembers);
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: any) => {
    const newMembers = [...teamMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    onChange(newMembers);
  };

  const updateCommunicationPreference = (index: number, preference: keyof TeamMember['communicationPreferences'], value: boolean) => {
    const newMembers = [...teamMembers];
    newMembers[index].communicationPreferences[preference] = value;
    onChange(newMembers);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const rows = text.split('\n').map(row => row.trim()).filter(row => row.length > 0);
      const headers = rows[0].toLowerCase().split(',').map(h => h.trim());
      
      const members: TeamMember[] = rows.slice(1).map(row => {
        const values = row.split(',').map(v => v.trim());
        const member: Partial<TeamMember> = {
          name: '',
          role: '',
          responsibilities: '',
          communicationPreferences: {
            email: false,
            sms: false,
            call: false,
            slack: false
          }
        };
        
        headers.forEach((header, i) => {
          if (i >= values.length) return;
          const value = values[i];
          
          switch(header) {
            case 'name':
              member.name = value;
              break;
            case 'role':
              member.role = value;
              break;
            case 'responsibilities':
              member.responsibilities = value;
              break;
            case 'email':
              member.email = value;
              break;
            case 'enneagramtype':
              member.enneagramType = value;
              break;
            case 'department':
              member.department = value;
              break;
            case 'email_comm':
              if (member.communicationPreferences) member.communicationPreferences.email = value.toLowerCase() === 'true';
              break;
            case 'sms_comm':
              if (member.communicationPreferences) member.communicationPreferences.sms = value.toLowerCase() === 'true';
              break;
            case 'call_comm':
              if (member.communicationPreferences) member.communicationPreferences.call = value.toLowerCase() === 'true';
              break;
            case 'slack_comm':
              if (member.communicationPreferences) member.communicationPreferences.slack = value.toLowerCase() === 'true';
              break;
          }
        });
        
        return member as TeamMember;
      });

      onChange(members);
      if (event.target) event.target.value = '';
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Error parsing CSV file. Please make sure it\'s in the correct format.');
    }
  };

  const downloadTemplate = () => {
    const headers = [
      'Name',
      'Role',
      'Responsibilities',
      'Email',
      'EnneagramType',
      'Department',
      'Email_Comm',
      'SMS_Comm',
      'Call_Comm',
      'Slack_Comm'
    ].join(',');

    const exampleRow = [
      'John Doe',
      'Software Engineer',
      'Development and maintenance of core features',
      'john@example.com',
      'Type 5',
      'Engineering',
      'true',
      'false',
      'true',
      'true'
    ].join(',');

    const template = [headers, exampleRow].join('\n');
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-200">Who's On Your Team?</h2>
        </div>
        <p className="text-neutral-400">
          Add team members, their roles, and responsibilities. We'll use this to understand your team structure.
        </p>
      </div>

      <div className="space-y-4">
        {teamMembers.map((member, index) => (
          <Collapsible key={index} open={openStates[index] ?? false}>
            <div className="grid grid-cols-[1fr,1fr,1fr,auto,auto] gap-4 items-center p-4 border border-neutral-800 rounded-lg bg-neutral-900">
              <Input
                placeholder="Full Name"
                value={member.name}
                onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-neutral-200 placeholder:text-neutral-500"
              />
              <Input
                placeholder="Role/Title"
                value={member.role}
                onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-neutral-200 placeholder:text-neutral-500"
              />
              <Input
                placeholder="Key responsibilities"
                value={member.responsibilities}
                onChange={(e) => updateTeamMember(index, 'responsibilities', e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-neutral-200 placeholder:text-neutral-500"
              />
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => toggleOpen(index)}
                  className="text-neutral-400 hover:text-neutral-200"
                >
                  {openStates[index] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeTeamMember(index)}
                className="text-neutral-400 hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-collapse data-[state=open]:animate-expand">
              <div className="grid grid-cols-2 gap-4 p-4 mt-2 border-t border-neutral-800 bg-neutral-900/50">
                <div className="space-y-4">
                  <Input
                    placeholder="Email"
                    value={member.email}
                    onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                    className="bg-neutral-800 border-neutral-700 text-neutral-200 placeholder:text-neutral-500"
                  />
                  <Input
                    placeholder="Enneagram Type"
                    value={member.enneagramType}
                    onChange={(e) => updateTeamMember(index, 'enneagramType', e.target.value)}
                    className="bg-neutral-800 border-neutral-700 text-neutral-200 placeholder:text-neutral-500"
                  />
                </div>
                <div className="space-y-4">
                  <Input
                    placeholder="Department"
                    value={member.department}
                    onChange={(e) => updateTeamMember(index, 'department', e.target.value)}
                    className="bg-neutral-800 border-neutral-700 text-neutral-200 placeholder:text-neutral-500"
                  />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-200">Communication Preferences</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`email-${index}`}
                          checked={member.communicationPreferences.email}
                          onCheckedChange={(checked) => updateCommunicationPreference(index, 'email', checked as boolean)}
                        />
                        <label 
                          htmlFor={`email-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-200"
                        >
                          Email
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`sms-${index}`}
                          checked={member.communicationPreferences.sms}
                          onCheckedChange={(checked) => updateCommunicationPreference(index, 'sms', checked as boolean)}
                        />
                        <label 
                          htmlFor={`sms-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-200"
                        >
                          SMS
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`call-${index}`}
                          checked={member.communicationPreferences.call}
                          onCheckedChange={(checked) => updateCommunicationPreference(index, 'call', checked as boolean)}
                        />
                        <label 
                          htmlFor={`call-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-200"
                        >
                          Call
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`slack-${index}`}
                          checked={member.communicationPreferences.slack}
                          onCheckedChange={(checked) => updateCommunicationPreference(index, 'slack', checked as boolean)}
                        />
                        <label 
                          htmlFor={`slack-${index}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-neutral-200"
                        >
                          Slack
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

        <div className="flex gap-4">
          <Button
            onClick={addTeamMember}
            className="flex-1 bg-neutral-800/50 border border-dashed border-neutral-700 text-neutral-400 hover:bg-neutral-700/50 hover:text-neutral-200"
          >
            + Add Team Member
          </Button>
          
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="bg-neutral-800/50 border-neutral-700 text-neutral-200 hover:bg-neutral-700/50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload CSV
            </Button>
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="bg-neutral-800/50 border-neutral-700 text-neutral-200 hover:bg-neutral-700/50"
            >
              <Download className="w-4 h-4 mr-2" />
              Template CSV
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
