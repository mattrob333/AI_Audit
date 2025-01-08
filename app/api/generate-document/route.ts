import { NextResponse } from 'next/server';
import { DocumentType } from '@/lib/types';
import { generateDocumentServer } from '@/lib/server/documents';

export async function POST(req: Request) {
  try {
    console.log('Starting document generation request...');
    
    // Check for OpenAI API key first
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key missing');
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await req.json();
      console.log('Request body:', JSON.stringify(body, null, 2));
    } catch (error) {
      console.error('Error parsing request body:', error);
      return NextResponse.json(
        { error: 'Invalid request body format' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.docType || !body.userData) {
      console.error('Missing required fields:', {
        hasDocType: Boolean(body.docType),
        hasUserData: Boolean(body.userData)
      });
      return NextResponse.json(
        { error: 'Missing required fields: docType and userData' },
        { status: 400 }
      );
    }

    const { docType, userData } = body;

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

    try {
      console.log('Calling generateDocumentServer...');
      const result = await generateDocumentServer(docType as DocumentType, userData);
      if (!result || !result.document) {
        console.error('No document content generated');
        return NextResponse.json(
          { error: 'Failed to generate document content' },
          { status: 500 }
        );
      }
      console.log('Document generated successfully');

      return NextResponse.json(result);
    } catch (error) {
      console.error('Error generating document:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate document';
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
