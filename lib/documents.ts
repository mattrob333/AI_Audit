import { openai } from './openai';

export interface ExaSearchResult {
  title: string;
  content: string;
  url: string;
}

export type DocumentType = 
  | 'executiveSummary'
  | 'upskilling'
  | 'aiPersonas'
  | 'chatbot'
  | 'automationPlan';

type UserData = {
  businessName: string;
  industry: string;
  teamSize?: number;
  currentTools?: string[];
  overview?: {
    businessOverview?: string;
    keyChallenges?: string[];
    strengths?: string[];
    integrationOpportunities?: string[];
    implementationConsiderations?: string;
    timeline?: Record<string, string[]>;
    trainingNeeds?: string[];
    complianceAndSecurity?: string;
  };
};

async function searchExa(type: 'industry' | 'company' | 'useCases', query: string): Promise<ExaSearchResult[]> {
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type, query }),
  });

  if (!response.ok) {
    throw new Error('Failed to perform search');
  }

  const data = await response.json();
  return data.results;
}

async function enrichPromptWithExaData(docType: DocumentType, userData: UserData): Promise<ExaSearchResult[]> {
  switch (docType) {
    case 'executiveSummary':
      return await searchExa('company', userData.businessName);
    case 'upskilling':
      return await searchExa('industry', userData.industry);
    case 'aiPersonas':
    case 'chatbot':
    case 'automationPlan':
      return await searchExa('useCases', userData.industry);
    default:
      return [];
  }
}

export async function generateDocument(docType: DocumentType, userData: UserData): Promise<string> {
  const response = await fetch('/api/generate-document', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ docType, userData }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate document');
  }

  const data = await response.json();
  return data.document;
}
