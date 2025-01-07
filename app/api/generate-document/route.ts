import { NextResponse } from 'next/server';
import { DocumentType } from '@/lib/types';
import { generateDocumentServer } from '@/lib/server/documents';

export async function POST(req: Request) {
  try {
    console.log('Starting document generation request...');
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    // Check for OpenAI API key first
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key missing');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }
    console.log('OpenAI API key found');

    if (!body.docType || !body.userData) {
      console.error('Missing required fields in request body');
      return NextResponse.json(
        { error: 'Missing required fields: docType and userData' },
        { status: 400 }
      );
    }

    const { docType, userData } = body;
    console.log('Document type:', docType);
    console.log('User data:', JSON.stringify(userData, null, 2));

    // Validate userData has required fields
    if (!userData.aiSummary || !userData.userDescription) {
      console.error('Missing required user data fields:', {
        hasAiSummary: Boolean(userData.aiSummary),
        hasUserDescription: Boolean(userData.userDescription)
      });
      return NextResponse.json(
        { error: 'Missing required user data fields: aiSummary and userDescription' },
        { status: 400 }
      );
    }
    console.log('User data validation passed');

    try {
      console.log('Calling generateDocumentServer...');
      const document = await generateDocumentServer(docType as DocumentType, userData);
      if (!document) {
        console.error('No document content generated');
        return NextResponse.json(
          { error: 'Failed to generate document content' },
          { status: 500 }
        );
      }
      console.log('Document generated successfully');

      return NextResponse.json({ document });
    } catch (error) {
      console.error('Error generating document:', error);
      return NextResponse.json(
        { error: 'Failed to generate document' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
