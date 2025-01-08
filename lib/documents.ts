import OpenAI from 'openai';
import { getOpenAIClient } from './openai';

export interface ExaSearchResult {
  title: string;
  content: string;
  url: string;
}

export type DocumentType = 
  | 'executiveSummary'
  | 'upskilling'
  | 'aiPersonas'
  | 'customerChatbot'
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
    case 'customerChatbot':
    case 'automationPlan':
      return await searchExa('useCases', userData.industry);
    default:
      return [];
  }
}

interface GenerateDocumentParams {
  businessDetails: any;
  teamDetails: any;
  auditAnswers: any[];
  overview: any;
  documentType: DocumentType;
}

interface Prompt {
  system: string;
  user: string;
}

async function buildDocumentPrompt(documentType: DocumentType, data: any): Promise<Prompt> {
  // TO DO: implement prompt building logic
  // For now, just return a dummy prompt
  return {
    system: `You are an AI integration expert. Generate a detailed ${documentType} document based on the provided business information and research data. The document should be in markdown format with clear sections and bullet points where appropriate.`,
    user: `
Business Details:
${JSON.stringify(data.businessDetails, null, 2)}

Team Details:
${JSON.stringify(data.teamDetails, null, 2)}

Audit Answers:
${JSON.stringify(data.auditAnswers, null, 2)}

Business Overview and Analysis:
${JSON.stringify(data.overview, null, 2)}

Additional Research Context:
${data.searchResults.map((result: ExaSearchResult) => `${result.title}:\n${result.content}`).join('\n\n')}

Please generate a detailed ${documentType} document in markdown format.`
  };
}

export async function generateDocument({
  businessDetails,
  teamDetails,
  auditAnswers,
  overview,
  documentType
}: GenerateDocumentParams): Promise<string> {
  // Get relevant search results to enrich the prompt
  const searchResults = await enrichPromptWithExaData(documentType, {
    businessName: businessDetails.businessName,
    industry: businessDetails.industry,
    overview
  });

  // Build the prompt based on document type
  const prompt = await buildDocumentPrompt(documentType, {
    businessDetails,
    teamDetails,
    auditAnswers,
    overview,
    searchResults
  });

  const response = await getOpenAIClient().chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: prompt.system },
      { role: "user", content: prompt.user }
    ],
    temperature: 0.7,
    max_tokens: 2500
  });

  return response.choices[0].message.content || '';
}
