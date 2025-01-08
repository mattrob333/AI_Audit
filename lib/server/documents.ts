import { getOpenAIClient } from '../openai';
import { DocumentType } from '../types';
import { searchIndustryInsights, searchCompanyInfo, searchAIUseCases, ExaSearchResult } from './exa';

type UserData = {
  // Step 1 data
  businessUrl: string;
  aiSummary: string;
  userDescription: string;
  
  // Step 2 data (optional)
  teamSize?: number;
  teamMembers?: Array<{
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
  }>;
  currentSoftware?: string[];
  aiToolsOfInterest?: string[];
  
  // Step 3 data (optional)
  keyChallenges?: string[];
  strengths?: string[];
  integrationOpportunities?: string[];
  implementationConsiderations?: string;
  timeline?: Record<string, string[]>;
  trainingNeeds?: string[];
  complianceAndSecurity?: string;
};

async function enrichPromptWithExaData(docType: DocumentType, userData: UserData): Promise<ExaSearchResult[]> {
  // Skip Exa search if no API key is configured
  if (!process.env.EXA_API_KEY) {
    console.log('Skipping Exa search - no API key configured');
    return [];
  }

  try {
    // Extract business name from URL or description
    const businessName = userData.businessUrl.split('//')[1]?.split('/')[0] || 'the business';
    
    switch (docType) {
      case 'executiveSummary':
        return await searchCompanyInfo(businessName);
      case 'upskilling':
        // Use the first part of the AI summary to determine industry
        const industry = userData.aiSummary.split('.')[0];
        return await searchIndustryInsights(industry);
      case 'aiPersonas':
      case 'customerChatbot':
      case 'automationPlan':
        return await searchAIUseCases(userData.aiSummary);
      default:
        return [];
    }
  } catch (error) {
    console.error('Error enriching prompt with Exa data:', error);
    return [];
  }
}

export async function generateDocumentServer(docType: DocumentType, userData: UserData): Promise<string> {
  // Get relevant external data from Exa (will be empty if no API key)
  const exaResults = await enrichPromptWithExaData(docType, userData);
  
  // Build the system prompt based on document type
  let systemPrompt = '';
  
  switch (docType) {
    case 'executiveSummary':
      systemPrompt = `You are a top-tier AI consultant specializing in modernizing businesses through AI-driven strategies. Please create a compelling, forward-looking Executive Summary in Markdown format that:

- Summarizes the current state of the business based on: ${userData.userDescription}
- Analyzes their AI vision: ${userData.aiSummary}
- Highlights key opportunities for AI integration, emphasizing how these solutions will propel them into a more competitive position
- Maintains an encouraging tone, reinforcing their momentum and readiness to embrace AI innovations

Additional context:
${exaResults.map(r => `- ${r.content}`).join('\n')}`;
      break;
      
    case 'upskilling':
      systemPrompt = `You are a leading AI adoption strategist focusing on developing high-impact training programs. Create a comprehensive Upskilling Document in Markdown format that:

- Outlines prompt engineering techniques and AI coding tool best practices
- Explains how to shift the team's mindset to fully leverage AI for problem-solving and creativity
- Specifies practical steps, recommended learning milestones, and ongoing support resources

Team Context:
- Team Size: ${userData.teamSize || 'Not specified'}
- Current Tools: ${userData.currentSoftware?.join(', ') || 'None specified'}
- AI Tools of Interest: ${userData.aiToolsOfInterest?.join(', ') || 'None specified'}
- Key Challenges: ${userData.keyChallenges?.join(', ') || 'None specified'}

Additional insights:
${exaResults.map(r => `- ${r.content}`).join('\n')}`;
      break;
      
    case 'aiPersonas':
      systemPrompt = `You are an AI persona designer specializing in creating intuitive AI interfaces. Create a detailed AI Personas Document in Markdown format that:

- Analyzes the team's composition and needs based on: ${userData.teamMembers?.map(m => `${m.role}: ${m.responsibilities}`).join(', ')}
- Defines distinct AI personas tailored to different user groups within the organization
- Specifies the tone, capabilities, and limitations of each AI persona
- Includes example interactions and use cases

Market research:
${exaResults.map(r => `- ${r.content}`).join('\n')}`;
      break;
      
    case 'customerChatbot':
      systemPrompt = `You are a conversational AI expert focusing on customer experience. Create a Customer Chatbot Strategy Document in Markdown format that:

- Analyzes the business context: ${userData.userDescription}
- Outlines a phased approach to implementing an AI chatbot
- Specifies required capabilities, training data sources, and integration points
- Includes example conversation flows and edge cases to handle

Similar implementations:
${exaResults.map(r => `- ${r.content}`).join('\n')}`;
      break;
      
    case 'automationPlan':
      systemPrompt = `You are an AI automation architect specializing in business process optimization. Create a detailed Automation Plan in Markdown format that:

- Analyzes current workflows based on: ${userData.userDescription}
- Identifies high-impact automation opportunities
- Provides a phased implementation roadmap with clear milestones
- Includes success metrics and ROI calculations

Industry best practices:
${exaResults.map(r => `- ${r.content}`).join('\n')}`;
      break;

    default:
      throw new Error(`Unsupported document type: ${docType}`);
  }

  const openai = getOpenAIClient();
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-1106-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Generate the document following the above instructions." }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    return completion.choices[0]?.message?.content || 'Failed to generate document';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate document content');
  }
}
