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
${exaResults.map(r => `- ${r.snippet}`).join('\n')}`;
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
${exaResults.map(r => `- ${r.snippet}`).join('\n')}`;
      break;
      
    case 'aiPersonas':
      systemPrompt = `You are an expert AI architect specializing in designing AI-driven organizational structures. The user's business requires four high-impact AI personas (like "department heads") to assist with Marketing, Sales, Operations, and other critical functions. Please create a detailed AiPersonas document in Markdown format that:

- Introduces four "world-class" AI experts with names, departments, and clear role definitions
- Specifies skill sets, competencies, and the knowledge base each persona should have access to (e.g., product catalogs, brand guidelines, etc.)
- Lists goals or KPIs each persona aims to achieve, aligned with the user's market and service offerings
- Ensures these AI personas will augment the human team's strengths and help them reach new levels of efficiency and success

Incorporate actionable insights and any industry research relevant to designing effective AI "org charts."`;
      break;
      
    case 'customerChatbot':
      systemPrompt = `You are a customer experience and AI consultant skilled in developing impactful support chatbots. The user wants a customer-facing chatbot that answers FAQs, showcases the company's products/services, and aligns with brand guidelines. Please create a detailed chatbot document in Markdown format that:

- Defines the chatbot's persona (tone, style, do's/don'ts)
- Specifies system instructions and any internal documentation or knowledge bases it should reference (e.g., product sheets, shipping policies, troubleshooting steps)
- Explains how the bot maintains brand consistency, handles compliance, and gracefully escalates complex queries to human support
- Provides example interactions or prompts so the user can see typical Q&A flows

Use actionable insights from:
1. The user's business context (products, services, brand voice)
2. Best practices in AI-driven customer support`;
      break;
      
    case 'automationPlan':
      systemPrompt = `You are a solutions architect with extensive expertise in workflow automation and AI integration. The user wants a high-level Automation Plan that outlines how to connect their existing software stack (e.g., Slack, CRM, etc.) with AI services like Make.com, Zapier, or LangChain. Please create a detailed automationPlan document in Markdown format that:

- Proposes five realistic automations or integration workflows specifically benefiting their business (e.g., email outreach, lead routing, chat-based status updates, data analytics triggers)
- Uses high-level, yet detailed instructions on how these automations work and which tools they involve (Make.com, Zapier, custom scripts, etc.)
- Showcases how AI can streamline processes, reduce manual tasks, and create real-time insights
- Encourages the user that by implementing these automations, they can achieve optimal efficiency and unlock new growth opportunities

Incorporate actionable recommendations drawn from:
1. The user's company details (current tools, business model)
2. Industry research on best automation practices`;
      break;
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
