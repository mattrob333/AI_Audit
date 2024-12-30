import { NextResponse } from 'next/server';
import { generateQuestions } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { businessDetails, teamDetails } = await request.json();
    
    if (!businessDetails || !teamDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const questions = await generateQuestions(businessDetails, teamDetails);
    
    // Return questions wrapped in an object with a questions property
    return NextResponse.json({ questions: questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
