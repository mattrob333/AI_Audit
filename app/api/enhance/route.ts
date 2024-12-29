import { NextResponse } from 'next/server';
import { enhanceAnswer } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { question, answer } = await request.json();
    
    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Missing question or answer' },
        { status: 400 }
      );
    }

    const enhancedAnswer = await enhanceAnswer(question, answer);
    
    return NextResponse.json({ enhancedAnswer });
  } catch (error) {
    console.error('Error enhancing answer:', error);
    return NextResponse.json(
      { error: 'Failed to enhance answer' },
      { status: 500 }
    );
  }
}
