export class DocumentGenerationError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = 'DocumentGenerationError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function handleApiError(error: unknown): { error: string; status: number } {
  if (error instanceof DocumentGenerationError) {
    return { error: error.message, status: 400 };
  }
  if (error instanceof ValidationError) {
    return { error: error.message, status: 422 };
  }
  console.error('Unexpected error:', error);
  return { 
    error: 'An unexpected error occurred', 
    status: 500 
  };
}
