import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GenerateDocumentSchema, BusinessOverviewSchema } from '@/lib/validation';
import { handleApiError } from '@/lib/errors';
import { DocumentGenerationError } from '@/lib/errors';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key is missing');
    return NextResponse.json(
      { error: 'OpenAI API key is not configured' },
      { status: 500 }
    );
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      throw new DocumentGenerationError('Invalid JSON in request body', 'INVALID_JSON');
    }

    // Validate request body against schema
    const validationResult = GenerateDocumentSchema.safeParse(body);
    if (!validationResult.success) {
      throw new DocumentGenerationError(
        validationResult.error.errors[0].message,
        'VALIDATION_ERROR'
      );
    }

    const { businessDetails } = validationResult.data;
    const { businessUrl, aiSummary, userDescription } = businessDetails;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [{
      role: "system",
      content: `You are an AI integration expert. Analyze the following business information and create a comprehensive overview and integration plan. Focus on identifying key strengths, weaknesses, and opportunities for AI integration.

Your response must be a valid JSON object following the exact structure provided.`
    }, {
      role: "user",
      content: `Here is the company information to analyze:

Business Details:
- Business URL: ${businessUrl}
- AI Analysis: ${aiSummary}
- User Description: ${userDescription}

Generate a detailed analysis in this exact JSON structure:
{
  "businessOverview": "A clear, concise summary of the business",
  "keyChallenges": ["Challenge 1", "Challenge 2", "Challenge 3"],
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "integrationOpportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"],
  "implementationConsiderations": ["Consideration 1", "Consideration 2", "Consideration 3"],
  "timeline": {
    "phase1_assessment": "First 30 days: Description of initial assessment and planning",
    "phase2_implementation": "Days 31-90: Description of initial implementation",
    "phase3_expansion": "Days 91-180: Description of expansion and optimization"
  },
  "trainingNeeds": ["Training need 1", "Training need 2", "Training need 3"],
  "complianceAndSecurity": ["Security consideration 1", "Security consideration 2", "Security consideration 3"]
}`
    }];

    console.log('Sending request to OpenAI...');
    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages,
        temperature: 0.7,
      });
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new DocumentGenerationError(
        error instanceof Error ? error.message : 'Failed to communicate with OpenAI API',
        'OPENAI_ERROR'
      );
    }

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new DocumentGenerationError('No content in OpenAI response', 'EMPTY_RESPONSE');
    }

    console.log('Parsing OpenAI response...');
    try {
      const parsedContent = JSON.parse(content);
      // Validate the response structure matches our BusinessOverviewSchema
      const responseValidation = BusinessOverviewSchema.safeParse(parsedContent);
      if (!responseValidation.success) {
        throw new DocumentGenerationError('Invalid response structure from OpenAI', 'INVALID_RESPONSE');
      }
      console.log('Successfully parsed and validated OpenAI response');
      return NextResponse.json(responseValidation.data);
    } catch (e) {
      console.error('Error parsing OpenAI response:', e);
      throw new DocumentGenerationError(
        e instanceof Error ? e.message : 'Invalid JSON response from OpenAI',
        'INVALID_RESPONSE'
      );
    }
  } catch (error) {
    const { error: errorMessage, status } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
