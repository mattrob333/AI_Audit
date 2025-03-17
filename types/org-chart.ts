export type ModelType = 
| 'gpt-4o' 
| 'gpt-4o-mini' 
| 'claude-3-5-sonnet-20241022'

export interface OrgMember {
  id: string
  name: string
  role: string
  department: string
  imageUrl?: string
  managerId?: string
  systemPrompt?: string
  model?: ModelType
}

export const initialOrgMembers: OrgMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "CEO",
    department: "Executive",
    managerId: undefined
  },
  {
    id: "2",
    name: "Michael Torres",
    role: "VP of Engineering",
    department: "Engineering",
    managerId: "1"
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    role: "VP of Marketing",
    department: "Marketing",
    managerId: "1"
  },
  {
    id: "4",
    name: "David Kim",
    role: "VP of Operations",
    department: "Operations",
    managerId: "1"
  },
  {
    id: "5",
    name: "Alex Johnson",
    role: "Lead Developer",
    department: "Engineering",
    managerId: "2"
  },
  {
    id: "6",
    name: "Sarah Park",
    role: "DevOps Manager",
    department: "Engineering",
    managerId: "2"
  },
  {
    id: "7",
    name: "James Wilson",
    role: "Brand Director",
    department: "Marketing",
    managerId: "3"
  },
  {
    id: "8",
    name: "Maria Garcia",
    role: "Digital Marketing Manager",
    department: "Marketing",
    managerId: "3"
  },
  {
    id: "9",
    name: "Thomas Lee",
    role: "Project Manager",
    department: "Operations",
    managerId: "4"
  },
  {
    id: "10",
    name: "Lisa Chen",
    role: "Quality Assurance Lead",
    department: "Operations",
    managerId: "4"
  }
]
