import { NextResponse } from 'next/server';

export class DocumentGenerationError extends Error {
  public readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
    this.name = 'DocumentGenerationError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof DocumentGenerationError) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  if (error instanceof ValidationError) {
    return NextResponse.json(
      { error: error.message },
      { status: 422 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}
