import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';
import { GenerateOverviewRequestSchema, BusinessOverviewSchema } from '@/lib/validation';
import { handleApiError } from '@/lib/errors';
import { DocumentGenerationError } from '@/lib/errors';

const FLOWISE_ENDPOINT = "https://flowise-jc8z.onrender.com/api/v1/prediction/0397dc74-c6f6-4e34-912d-a6d788f9e19a";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function queryFlowise(businessUrl: string) {
  console.log('Querying Flowise with URL:', businessUrl);
  try {
    console.log('Making request to Flowise endpoint:', FLOWISE_ENDPOINT);
    const response = await fetch(FLOWISE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        question: businessUrl
      })
    });

    console.log('Flowise response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Flowise error response:', errorText);
      throw new Error(`Flowise API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Flowise raw response:', result);
    
    // Extract the actual text content from the Flowise response
    let flowiseText;
    if (typeof result === 'string') {
      flowiseText = result;
    } else if (result.text) {
      flowiseText = result.text;
    } else if (result.answer) {
      flowiseText = result.answer;
    } else {
      flowiseText = JSON.stringify(result);
    }
    
    console.log('Extracted Flowise text:', flowiseText);
    
    if (!flowiseText || flowiseText.trim() === '') {
      throw new Error('Flowise returned empty response');
    }
    
    return flowiseText;
  } catch (error) {
    console.error('Flowise API error:', error);
    throw new DocumentGenerationError(
      error instanceof Error ? error.message : 'Failed to get AI roadmap from Flowise',
      'FLOWISE_ERROR'
    );
  }
}

async function transformFlowiseOutput(flowiseReport: string) {
  console.log('Transforming Flowise output...');
  console.log('Input report:', flowiseReport);
  
  try {
    const systemPrompt = `You are a data transformation expert. Your task is to transform an AI roadmap report into a structured JSON format that matches this exact schema:

{
  "businessOverview": {
    "summary": string,
    "vision": string,
    "objectives": string[]
  },
  "keyChallenges": [{
    "challenge": string,
    "impact": string,
    "priority": "High" | "Medium" | "Low"
  }],
  "strengths": [{
    "area": string,
    "description": string,
    "leverageOpportunity": string
  }],
  "integrationOpportunities": [{
    "area": string,
    "description": string,
    "benefit": string,
    "prerequisite": string
  }],
  "implementationConsiderations": [{
    "category": string,
    "points": string[],
    "risksAndMitigation": string[]
  }],
  "timeline": {
    "phase1_assessment": {
      "duration": string,
      "activities": string[],
      "deliverables": string[]
    },
    "phase2_implementation": {
      "duration": string,
      "activities": string[],
      "deliverables": string[]
    },
    "phase3_expansion": {
      "duration": string,
      "activities": string[],
      "deliverables": string[]
    }
  },
  "quickWins": [{
    "title": string,
    "description": string,
    "estimatedTimeSavedPerWeek": string,
    "roiPotential": string,
    "implementationComplexity": "Low" | "Medium" | "High",
    "steps": string[]
  }],
  "longTermOpportunities": [{
    "title": string,
    "description": string,
    "timeHorizon": string,
    "roiPotential": string,
    "strategicValue": "High" | "Very High" | "Transformative",
    "keyMilestones": string[]
  }],
  "industryTrends": [{
    "trend": string,
    "impact": string,
    "adoptionRate": string,
    "relevance": string,
    "recommendations": string[]
  }]
}

Rules:
1. The output MUST match this schema exactly - all fields are required
2. All arrays must have at least one item
3. Enum values must match exactly:
   - priority: "High", "Medium", or "Low"
   - implementationComplexity: "Low", "Medium", or "High"
   - strategicValue: "High", "Very High", or "Transformative"
4. If information isn't explicitly present in the input, derive it logically from context
5. Keep text concise but informative

Transform this AI roadmap report into the specified JSON structure. If you can't find explicit information for a field, derive it logically from the context. Ensure all enum values match exactly: implementationComplexity must be one of ["Low", "Medium", "High"] and strategicValue must be one of ["High", "Very High", "Transformative"].\n\n${flowiseReport}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Transform this AI roadmap report into the specified JSON structure. If you can't find explicit information for a field, derive it logically from the context. Ensure all enum values match exactly: implementationComplexity must be one of ["Low", "Medium", "High"] and strategicValue must be one of ["High", "Very High", "Transformative"].\n\n${flowiseReport}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 4000
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    console.log('GPT-4 transformation complete, raw response:', content);
    
    try {
      const formattedData = JSON.parse(content);
      console.log('Parsed JSON data structure:', JSON.stringify(formattedData, null, 2));
      
      // Log the expected schema structure
      console.log('Expected schema structure:', JSON.stringify(BusinessOverviewSchema.shape, null, 2));
      
      // Validate each major section individually to pinpoint issues
      const sections = [
        'businessOverview',
        'keyChallenges',
        'strengths',
        'integrationOpportunities',
        'implementationConsiderations',
        'timeline',
        'quickWins',
        'longTermOpportunities',
        'industryTrends'
      ] as const;  // Make this a const array to help with type inference
      
      for (const section of sections) {
        if (formattedData[section]) {
          console.log(`Validating section: ${section}`);
          console.log(`Section data:`, JSON.stringify(formattedData[section], null, 2));
          
          // Create a partial schema for just this section
          const partialSchema = z.object({
            [section]: BusinessOverviewSchema.shape[section]
          });
          
          const sectionValidation = partialSchema.safeParse({ [section]: formattedData[section] });
          if (!sectionValidation.success) {
            console.error(`Validation failed for ${section}:`, sectionValidation.error.errors);
          }
        } else {
          console.error(`Missing required section: ${section}`);
        }
      }
      
      // Validate the complete data
      console.log('Validating complete formatted data...');
      const validation = BusinessOverviewSchema.safeParse(formattedData);
      if (!validation.success) {
        console.error('Validation errors:', validation.error.errors);
        throw new Error(`Data validation failed: ${validation.error.errors.map(e => e.message).join(', ')}`);
      }

      console.log('Data validation successful');
      return validation.data;
    } catch (parseError: unknown) {
      console.error('JSON parsing error:', parseError);
      throw new Error(`Failed to parse GPT-4 response: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }
  } catch (error) {
    console.error('Error transforming Flowise output:', error);
    throw new DocumentGenerationError(
      error instanceof Error ? error.message : 'Failed to transform AI roadmap data',
      'TRANSFORMATION_ERROR'
    );
  }
}

export async function POST(req: Request) {
  console.log('Received POST request to /api/generate-overview');
  
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
      console.log('Request body:', body);
    } catch (e) {
      console.error('Error parsing request body:', e);
      throw new DocumentGenerationError('Invalid JSON in request body', 'INVALID_JSON');
    }

    // Validate request body against schema
    const validationResult = GenerateOverviewRequestSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Request validation failed:', validationResult.error.errors);
      throw new DocumentGenerationError(
        validationResult.error.errors[0].message,
        'VALIDATION_ERROR'
      );
    }

    const { businessUrl } = validationResult.data;

    // 1. Get AI roadmap from Flowise
    console.log('Fetching AI roadmap from Flowise...');
    let flowiseReport;
    try {
      flowiseReport = await queryFlowise(businessUrl);
      console.log('Flowise report received:', flowiseReport);
    } catch (error) {
      console.error('Error getting Flowise report:', error);
      throw error;
    }

    // 2. Transform the report into our required JSON structure
    console.log('Transforming Flowise output...');
    let formattedData;
    try {
      formattedData = await transformFlowiseOutput(flowiseReport);
      console.log('Transformed data:', formattedData);
    } catch (error) {
      console.error('Error transforming Flowise output:', error);
      throw error;
    }

    // 3. Return the formatted data
    console.log('Sending response...');
    return NextResponse.json(formattedData);

  } catch (error) {
    console.error('Error in generate-overview:', error);
    return handleApiError(error);
  }
}
