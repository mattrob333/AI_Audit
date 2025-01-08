export type DocumentType = 
  | 'executiveSummary'
  | 'upskilling'
  | 'aiPersonas'
  | 'customerChatbot'
  | 'automationPlan';

// Business Details (Step 1)
export interface BusinessDetails {
  businessUrl: string;
  aiSummary: string;
  userDescription: string;
}

// Team Details (Step 2)
export interface TeamMember {
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
    };
    aiSkills?: string[];
  }
}

export interface TeamDetails {
  teamSize: number;
  teamMembers: TeamMember[];
  currentSoftware: string[];
  aiToolsOfInterest: string[];
}

// Business Overview (Step 3)
export interface BusinessOverview {
  keyChallenges: string[];
  strengths: string[];
  integrationOpportunities: string[];
  implementationConsiderations: string;
  timeline: Record<string, string[]>;
  trainingNeeds: string[];
  complianceAndSecurity: string;
}

// Audit Answers
export interface AuditAnswer {
  question: string;
  answer: string;
}

// Document Generation Types
export interface DocumentState {
  currentDocument: string | null;
  generationStatus: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
}

export interface GenerateDocumentParams {
  docType: DocumentType;
  userData: {
    // Step 1
    businessUrl: string;
    aiSummary: string;
    userDescription: string;
    
    // Step 2
    teamSize?: number;
    teamMembers?: TeamMember[];
    currentSoftware?: string[];
    aiToolsOfInterest?: string[];
    
    // Step 3
    keyChallenges?: string[];
    strengths?: string[];
    integrationOpportunities?: string[];
    implementationConsiderations?: string;
    timeline?: Record<string, string[]>;
    trainingNeeds?: string[];
    complianceAndSecurity?: string;
  }
}
