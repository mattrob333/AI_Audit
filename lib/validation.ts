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

export const BusinessOverviewSchema = z.object({
  businessOverview: z.string().min(1, 'Business overview is required'),
  keyChallenges: z.array(z.string()),
  strengths: z.array(z.string()),
  integrationOpportunities: z.array(z.string()),
  implementationConsiderations: z.string(),
  timeline: z.object({
    phase1_assessment: z.string(),
    phase2_implementation: z.string(),
    phase3_expansion: z.string()
  }),
  trainingNeeds: z.array(z.string()),
  complianceAndSecurity: z.array(z.string())
});

export const GenerateDocumentSchema = z.object({
  businessDetails: BusinessDetailsSchema,
  teamDetails: TeamDetailsSchema,
  auditAnswers: z.array(AuditAnswerSchema),
  overview: BusinessOverviewSchema,
  documentType: z.enum(['executiveSummary', 'upskilling', 'aiPersonas', 'chatbot', 'automationPlan'] as const)
});
