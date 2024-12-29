import { openai } from '../openai';
import { DocumentType } from '../documents';
import { searchIndustryInsights, searchCompanyInfo, searchAIUseCases, ExaSearchResult } from './exa';

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

async function enrichPromptWithExaData(docType: DocumentType, userData: UserData): Promise<ExaSearchResult[]> {
  switch (docType) {
    case 'executiveSummary':
      return await searchCompanyInfo(userData.businessName);
    case 'upskilling':
      return await searchIndustryInsights(userData.industry);
    case 'aiPersonas':
    case 'chatbot':
    case 'automationPlan':
      return await searchAIUseCases(userData.industry);
    default:
      return [];
  }
}

export async function generateDocumentServer(docType: DocumentType, userData: UserData): Promise<string> {
  // Get relevant external data from Exa
  const exaResults = await enrichPromptWithExaData(docType, userData);
  
  // Build the system prompt based on document type
  const systemPrompt = `You are an expert AI consultant helping businesses implement AI solutions.
Create a detailed ${docType} document in markdown format.
Include specific, actionable insights based on the provided business context, AI integration plan, and industry research.`;

  // Build the user prompt with enriched data
  const userPrompt = `
Business Context:
-- Company: ${userData.businessName}
-- Industry: ${userData.industry}
${userData.teamSize ? `- Team Size: ${userData.teamSize}` : ''}
${userData.currentTools ? `- Current Tools: ${userData.currentTools.join(', ')}` : ''}

${userData.overview ? `
AI Integration Plan Overview:
${userData.overview.businessOverview ? `
Business Overview:
${userData.overview.businessOverview}` : ''}

${userData.overview.keyChallenges?.length ? `
Key Challenges:
${userData.overview.keyChallenges.map(c => `- ${c}`).join('\n')}` : ''}

${userData.overview.strengths?.length ? `
Strengths:
${userData.overview.strengths.map(s => `- ${s}`).join('\n')}` : ''}

${userData.overview.integrationOpportunities?.length ? `
Integration Opportunities:
${userData.overview.integrationOpportunities.map(o => `- ${o}`).join('\n')}` : ''}

${userData.overview.implementationConsiderations ? `
Implementation Considerations:
${userData.overview.implementationConsiderations}` : ''}

${userData.overview.timeline ? `
Timeline:
${Object.entries(userData.overview.timeline)
  .map(([phase, tasks]) => `
${phase}:
${tasks.map(t => `- ${t}`).join('\n')}`)
  .join('\n')}` : ''}

${userData.overview.trainingNeeds?.length ? `
Training Needs:
${userData.overview.trainingNeeds.map(t => `- ${t}`).join('\n')}` : ''}

${userData.overview.complianceAndSecurity ? `
Compliance & Security:
${userData.overview.complianceAndSecurity}` : ''}
` : ''}

Industry Research and Insights:
${exaResults.map(result => `
Source: ${result.title}
${result.content}
Reference: ${result.url}
`).join('\n')}

Please create a comprehensive ${docType} document that incorporates these insights.
Format the response in clean, well-structured markdown with proper headings, lists, and code blocks where appropriate.`;

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    model: "gpt-4-1106-preview",
  });

  return completion.choices[0].message.content || '';
}
