import { z } from 'zod';
import { DocumentType } from './types';

export const BusinessDetailsSchema = z.object({
  businessUrl: z.string().url('Invalid business URL'),
  aiSummary: z.string().min(10, 'AI summary must be at least 10 characters'),
  userDescription: z.string().min(1, 'User description is required')
});

export const TeamMemberSchema = z.object({
  role: z.string().min(1, 'Role is required'),
  department: z.string().min(1, 'Department is required'),
  skillLevel: z.string().min(1, 'Skill level is required')
});

export const TeamDetailsSchema = z.object({
  teamSize: z.string().min(1, 'Team size is required'),
  members: z.array(TeamMemberSchema)
});

export const AuditAnswerSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required')
});

export const GenerateOverviewRequestSchema = z.object({
  businessUrl: z.string().url('Invalid business URL'),
  aiSummary: z.string().min(10, 'AI summary must be at least 10 characters'),
  userDescription: z.string().min(1, 'User description is required')
});

export const BusinessOverviewSchema = z.object({
  businessOverview: z.object({
    summary: z.string().min(1, 'Business summary is required'),
    vision: z.string().min(1, 'AI vision statement is required'),
    objectives: z.array(z.string())
  }),
  keyChallenges: z.array(z.object({
    challenge: z.string(),
    impact: z.string(),
    priority: z.enum(['High', 'Medium', 'Low'])
  })),
  strengths: z.array(z.object({
    area: z.string(),
    description: z.string(),
    leverageOpportunity: z.string()
  })),
  integrationOpportunities: z.array(z.object({
    area: z.string(),
    description: z.string(),
    benefit: z.string(),
    prerequisite: z.string()
  })),
  implementationConsiderations: z.array(z.object({
    category: z.string(),
    points: z.array(z.string()),
    risksAndMitigation: z.array(z.string())
  })),
  timeline: z.object({
    phase1_assessment: z.object({
      duration: z.string(),
      activities: z.array(z.string()),
      deliverables: z.array(z.string())
    }),
    phase2_implementation: z.object({
      duration: z.string(),
      activities: z.array(z.string()),
      deliverables: z.array(z.string())
    }),
    phase3_expansion: z.object({
      duration: z.string(),
      activities: z.array(z.string()),
      deliverables: z.array(z.string())
    })
  }),
  quickWins: z.array(z.object({
    title: z.string(),
    description: z.string(),
    estimatedTimeSavedPerWeek: z.string(),
    roiPotential: z.string(),
    implementationComplexity: z.enum(['Low', 'Medium', 'High']),
    steps: z.array(z.string())
  })),
  longTermOpportunities: z.array(z.object({
    title: z.string(),
    description: z.string(),
    timeHorizon: z.string(),
    roiPotential: z.string(),
    strategicValue: z.enum(['High', 'Very High', 'Transformative']),
    keyMilestones: z.array(z.string())
  })),
  industryTrends: z.array(z.object({
    trend: z.string(),
    impact: z.string(),
    adoptionRate: z.string(),
    relevance: z.string(),
    recommendations: z.array(z.string())
  }))
});

export const GenerateDocumentSchema = z.object({
  businessDetails: BusinessDetailsSchema,
  teamDetails: TeamDetailsSchema,
  auditAnswers: z.array(AuditAnswerSchema),
  overview: BusinessOverviewSchema,
  documentType: z.enum(['executiveSummary', 'upskilling', 'aiPersonas', 'chatbot', 'automationPlan'] as const)
});
