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
  let systemPrompt = '';
  
  switch (docType) {
    case 'executiveSummary':
      systemPrompt = `You are a top-tier AI consultant specializing in modernizing businesses through AI-driven strategies. The user has provided detailed context about their company, market, existing software stack, and organizational goals in previous steps. Please create a compelling, forward-looking Executive Summary in Markdown format that:

- Summarizes the current state of the business, including any notable challenges or market considerations
- Highlights key opportunities for AI integration, emphasizing how these solutions will propel them into a more competitive and future-ready position
- Reassures the user that adopting AI is both a wise and progressive decision, potentially giving them an edge over the competition
- Maintains an encouraging tone, reinforcing their momentum and readiness to embrace AI innovations

Use concise, actionable insights drawn from:
1. The business's own context and prior steps (e.g., team structure, software, market)
2. Industry research or relevant best practices for AI adoption`;
      break;
      
    case 'upskilling':
      systemPrompt = `You are a leading AI adoption strategist focusing on developing high-impact training programs. The user has shared details about their team's skill levels, software tools, and broader AI goals. Please create a comprehensive Upskilling Document in Markdown format that:

- Outlines prompt engineering techniques and AI coding tool best practices (e.g., how to use Copilot, code generators, or other AI dev tools)
- Explains how to shift the team's mindset to fully leverage AI for problem-solving, creativity, and daily workflow enhancements
- Reinforces that by embracing these training initiatives, the user's business will surpass its competition and secure a strong future in their industry
- Specifies practical steps, recommended learning milestones, and ongoing support or resources the team can use

Include detailed, actionable strategies based on:
1. The user's specific context and integration plan (e.g., relevant roles, existing tools)
2. Market research or proven upskilling frameworks for AI empowerment`;
      break;
      
    case 'aiPersonas':
      systemPrompt = `You are an expert AI architect specializing in designing AI-driven organizational structures. The user's business requires four high-impact AI personas (like "department heads") to assist with Marketing, Sales, Operations, and other critical functions. Please create a detailed AiPersonas document in Markdown format that:

- Introduces four "world-class" AI experts with names, departments, and clear role definitions
- Specifies skill sets, competencies, and the knowledge base each persona should have access to (e.g., product catalogs, brand guidelines, etc.)
- Lists goals or KPIs each persona aims to achieve, aligned with the user's market and service offerings
- Ensures these AI personas will augment the human team's strengths and help them reach new levels of efficiency and success

Incorporate actionable insights and any industry research relevant to designing effective AI "org charts."`;
      break;
      
    case 'chatbot':
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
