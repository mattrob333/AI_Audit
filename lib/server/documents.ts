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

export async function generateDocumentServer(docType: DocumentType, userData: UserData): Promise<{ document: string }> {
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
${exaResults.map(r => `- ${r.content}`).join('\n')}

IMPORTANT: Your response must be valid JSON with this exact structure:
{
  "content": "YOUR_MARKDOWN_CONTENT_HERE"
}

Replace YOUR_MARKDOWN_CONTENT_HERE with your executive summary in markdown format.
Do not include any additional fields in the JSON.`;
      break;
      
    case 'upskilling':
      systemPrompt = `You are a leading AI adoption strategist focusing on developing high-impact training programs. Create a comprehensive Upskilling Document in Markdown format that:

- Outlines prompt engineering techniques and AI coding tool best practices
- Explains how to shift the team's mindset to fully leverage AI for problem-solving and creativity
- Specifies practical steps, recommended learning milestones, and ongoing support resources

Team Context:
${userData.teamMembers ? JSON.stringify(userData.teamMembers, null, 2) : 'No team data provided'}

IMPORTANT: Your response must be valid JSON with this exact structure:
{
  "content": "YOUR_MARKDOWN_CONTENT_HERE"
}

Replace YOUR_MARKDOWN_CONTENT_HERE with your upskilling document in markdown format.
Do not include any additional fields in the JSON.`;
      break;
      
    case 'aiPersonas':
      systemPrompt = `You are an AI persona designer specializing in creating intuitive AI interfaces. Create a detailed AI Personas Document in Markdown format that:

- Analyzes the team's composition and needs based on: ${userData.teamMembers?.map(m => `${m.role}: ${m.responsibilities}`).join(', ')}
- Defines distinct AI personas tailored to different user groups within the organization
- Specifies the tone, capabilities, and limitations of each AI persona
- Includes example interactions and use cases

Market research:
${exaResults.map(r => `- ${r.content}`).join('\n')}

IMPORTANT: Your response must be valid JSON with this exact structure:
{
  "content": "YOUR_MARKDOWN_CONTENT_HERE"
}

Replace YOUR_MARKDOWN_CONTENT_HERE with your AI personas document in markdown format.
Do not include any additional fields in the JSON.`;
      break;
      
    case 'customerChatbot':
      systemPrompt = `You are a conversational AI expert focusing on customer experience. Create a Customer Chatbot Strategy Document in Markdown format that:

- Analyzes the business context: ${userData.userDescription}
- Outlines a phased approach to implementing an AI chatbot
- Specifies required capabilities, training data sources, and integration points
- Includes example conversation flows and edge cases to handle

Similar implementations:
${exaResults.map(r => `- ${r.content}`).join('\n')}

IMPORTANT: Your response must be valid JSON with this exact structure:
{
  "content": "YOUR_MARKDOWN_CONTENT_HERE"
}

Replace YOUR_MARKDOWN_CONTENT_HERE with your customer chatbot strategy document in markdown format.
Do not include any additional fields in the JSON.`;
      break;
      
    case 'automationPlan':
      systemPrompt = `You are an AI automation architect specializing in business process optimization and ROI-driven recommendations. Create a detailed Automation Plan in Markdown format that provides actionable insights and clear business value.

Business Context:
${userData.userDescription}

Current Challenges:
${userData.keyChallenges?.join('\n') || 'No specific challenges provided'}

Your response should include:

1. Quick Wins (3-4 recommendations):
- Immediate impact opportunities that can be implemented within 1-3 months
- Each must include estimated time savings per week
- Clear ROI potential (cost savings or revenue increase)
- Implementation complexity (Low/Medium/High)

2. Long-Term Opportunities (2-3 strategic initiatives):
- Transformative opportunities for the next 6-18 months
- Each must include an estimated timeline
- Strategic value and ROI potential
- Required capabilities and dependencies

3. Industry Trends (2-3 key trends):
- Relevant trends in ${userData.businessUrl.split('//')[1]?.split('/')[0] || 'their'} industry
- Impact on business operations
- Current adoption rates among competitors

Industry best practices and insights:
${exaResults.map(r => `- ${r.content}`).join('\n')}

IMPORTANT: Your response must be valid JSON with this exact structure:
{
  "content": "YOUR_MARKDOWN_CONTENT_HERE",
  "quickWins": [
    {
      "description": "Specific automation recommendation",
      "estimatedTimeSavedPerWeek": "X hours/week",
      "roiPotential": "Estimated impact (e.g., 30% cost reduction)",
      "implementationComplexity": "Low|Medium|High"
    }
  ],
  "longTermOpportunities": [
    {
      "description": "Strategic initiative description",
      "timeHorizon": "Expected timeline (e.g., 6-9 months)",
      "roiPotential": "Projected business impact",
      "strategicValue": "High|Very High|Transformative"
    }
  ],
  "industryTrends": [
    {
      "trend": "Industry trend description",
      "impact": "Potential impact on business",
      "adoptionRate": "Current adoption among competitors"
    }
  ]
}

Ensure all recommendations are specific, actionable, and include clear business value metrics.`;
      break;

    default:
      throw new Error(`Unsupported document type: ${docType}`);
  }

  // Call OpenAI API
  try {
    console.log('Calling OpenAI API...');
    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Generate the document now.' }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }  // Enforce JSON response format
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    try {
      // Parse the JSON response
      const parsedResponse = JSON.parse(content.trim());
      if (!parsedResponse.content || typeof parsedResponse.content !== 'string') {
        throw new Error('Invalid response format from OpenAI');
      }

      return { document: parsedResponse.content };
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Raw response:', content);
      throw new Error('Failed to parse OpenAI response as JSON');
    }
  } catch (error) {
    console.error('Error generating document:', error);
    throw error;
  }
}
