import { NextResponse } from 'next/server';
import { searchIndustryInsights, searchCompanyInfo, searchAIUseCases } from '@/lib/server/exa';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, query } = body;

    let results;
    switch (type) {
      case 'industry':
        results = await searchIndustryInsights(query);
        break;
      case 'company':
        results = await searchCompanyInfo(query);
        break;
      case 'useCases':
        results = await searchAIUseCases(query);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid search type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: 'Failed to perform search. Please try again.' },
      { status: 500 }
    );
  }
}
