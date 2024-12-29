import { NextResponse } from 'next/server';
import { DocumentType } from '@/lib/documents';
import { generateDocumentServer } from '@/lib/server/documents';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { docType, userData } = body;

    const document = await generateDocumentServer(docType as DocumentType, userData);
    return NextResponse.json({ document });
  } catch (error) {
    console.error('Error generating document:', error);
    return NextResponse.json(
      { error: 'Failed to generate document. Please try again.' },
      { status: 500 }
    );
  }
}
