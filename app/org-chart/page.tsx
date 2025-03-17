'use client'

import { PageHeader } from "@/components/page-header"
import { OrgChart } from "@/components/org-chart/org-chart"
import { OrgMember } from "@/types/org-chart"

const sampleMembers: OrgMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "CEO",
    department: "Executive",
    imageUrl: "",
    systemPrompt: "You are the CEO of an AI company, focused on strategic leadership and innovation.",
    model: "gpt-4o"
  },
  {
    id: "2",
    name: "Michael Torres",
    role: "VP of Engineering",
    department: "Engineering",
    managerId: "1",
    imageUrl: "",
    systemPrompt: "You are the VP of Engineering, responsible for technical direction and engineering excellence.",
    model: "gpt-4o"
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    role: "VP of Marketing",
    department: "Marketing",
    managerId: "1",
    imageUrl: "",
    systemPrompt: "You are the VP of Marketing, focused on market strategy and brand growth.",
    model: "gpt-4o"
  },
  {
    id: "4",
    name: "David Kim",
    role: "VP of Operations",
    department: "Operations",
    managerId: "1",
    imageUrl: "",
    systemPrompt: "You are the VP of Operations, ensuring smooth business operations and efficiency.",
    model: "gpt-4o"
  },
  {
    id: "5",
    name: "Lisa Chen",
    role: "Quality Assurance Lead",
    department: "Engineering",
    managerId: "2",
    imageUrl: "",
    systemPrompt: "You are the QA Lead, ensuring product quality and testing excellence.",
    model: "gpt-4o"
  },
  {
    id: "6",
    name: "James Wilson",
    role: "Senior Developer",
    department: "Engineering",
    managerId: "2",
    imageUrl: "",
    systemPrompt: "You are a Senior Developer, building robust and scalable solutions.",
    model: "gpt-4o"
  },
  {
    id: "7",
    name: "Maria Garcia",
    role: "Marketing Manager",
    department: "Marketing",
    managerId: "3",
    imageUrl: "",
    systemPrompt: "You are the Marketing Manager, executing marketing strategies and campaigns.",
    model: "gpt-4o"
  },
  {
    id: "8",
    name: "Robert Taylor",
    role: "Content Strategist",
    department: "Marketing",
    managerId: "3",
    imageUrl: "",
    systemPrompt: "You are the Content Strategist, developing engaging content strategies.",
    model: "gpt-4o"
  },
  {
    id: "9",
    name: "Emily Johnson",
    role: "Operations Manager",
    department: "Operations",
    managerId: "4",
    imageUrl: "",
    systemPrompt: "You are the Operations Manager, optimizing business processes.",
    model: "gpt-4o"
  },
  {
    id: "10",
    name: "Thomas Brown",
    role: "Logistics Coordinator",
    department: "Operations",
    managerId: "4",
    imageUrl: "",
    systemPrompt: "You are the Logistics Coordinator, managing supply chain operations.",
    model: "gpt-4o"
  }
]

export default function OrgChartPage() {
  return (
    <div className="h-full">
      <PageHeader
        heading="Organization Chart"
        subheading="View and interact with your AI organization structure"
      />
      <div className="h-[calc(100vh-6rem)] overflow-auto">
        <OrgChart members={sampleMembers} />
      </div>
    </div>
  )
}
