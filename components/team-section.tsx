'use client'

import * as React from 'react'
import { Plus, Upload, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type Department = {
  id: string
  name: string
  employees: string
  responsibilities: string
  skillLevel: string
}

const skillLevels = [
  { value: 'basic', label: 'Basic' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

export function TeamSection({
  departments,
  onDepartmentsChange,
}: {
  departments: Department[]
  onDepartmentsChange: (departments: Department[]) => void
}) {
  const addDepartment = () => {
    const newDepartment: Department = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      employees: '',
      responsibilities: '',
      skillLevel: 'basic',
    }
    onDepartmentsChange([...departments, newDepartment])
  }

  const updateDepartment = (id: string, field: keyof Department, value: string) => {
    const updatedDepartments = departments.map(dept =>
      dept.id === id ? { ...dept, [field]: value } : dept
    )
    onDepartmentsChange(updatedDepartments)
  }

  const removeDepartment = (id: string) => {
    const updatedDepartments = departments.filter(dept => dept.id !== id)
    onDepartmentsChange(updatedDepartments)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Who's On Your Team?</CardTitle>
        <CardDescription>
          Add departments, roles, and any relevant skill levels. If you have an org
          chart, upload it or paste a link.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <Button variant="outline" onClick={addDepartment}>
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload Org Chart
          </Button>
        </div>

        {departments.map(dept => (
          <div
            key={dept.id}
            className="grid gap-4 rounded-lg border p-4 relative"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => removeDepartment(dept.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div className="grid gap-2">
              <Label htmlFor={`dept-name-${dept.id}`}>Department Name</Label>
              <Input
                id={`dept-name-${dept.id}`}
                placeholder="e.g., Sales, Marketing, Operations"
                value={dept.name}
                onChange={e => updateDepartment(dept.id, 'name', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`dept-employees-${dept.id}`}>
                Number of Employees
              </Label>
              <Input
                id={`dept-employees-${dept.id}`}
                type="number"
                placeholder="e.g., 5"
                value={dept.employees}
                onChange={e =>
                  updateDepartment(dept.id, 'employees', e.target.value)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`dept-responsibilities-${dept.id}`}>
                Main Responsibilities
              </Label>
              <Textarea
                id={`dept-responsibilities-${dept.id}`}
                placeholder="Describe the key responsibilities and tasks of this department"
                value={dept.responsibilities}
                onChange={e =>
                  updateDepartment(dept.id, 'responsibilities', e.target.value)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`dept-skill-${dept.id}`}>
                AI/Data Skill Level
              </Label>
              <Select
                value={dept.skillLevel}
                onValueChange={value =>
                  updateDepartment(dept.id, 'skillLevel', value)
                }
              >
                <SelectTrigger id={`dept-skill-${dept.id}`}>
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

