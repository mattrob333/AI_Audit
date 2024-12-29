import Exa from 'exa-js';

if (!process.env.EXA_API_KEY) {
  throw new Error('Missing EXA_API_KEY environment variable');
}

const exa = new Exa(process.env.EXA_API_KEY);

export type ExaSearchResult = {
  title: string;
  content: string;
  url: string;
};

interface ExaApiResponse {
  title: string | null;
  text: string | null;
  url: string | null;
}

export async function searchIndustryInsights(industry: string): Promise<ExaSearchResult[]> {
  try {
    const results = await exa.searchAndContents(
      `latest trends and insights in ${industry} industry`,
      {
        useAutoprompt: true,
        numResults: 3,
        text: true
      }
    );

    return results.results.map((result: ExaApiResponse) => ({
      title: result.title || '',
      content: result.text || '',
      url: result.url || ''
    }));
  } catch (error) {
    console.error('Error fetching industry insights:', error);
    return [];
  }
}

export async function searchCompanyInfo(companyName: string): Promise<ExaSearchResult[]> {
  try {
    const results = await exa.searchAndContents(
      `company information and recent news about ${companyName}`,
      {
        useAutoprompt: true,
        numResults: 2,
        text: true
      }
    );

    return results.results.map((result: ExaApiResponse) => ({
      title: result.title || '',
      content: result.text || '',
      url: result.url || ''
    }));
  } catch (error) {
    console.error('Error fetching company info:', error);
    return [];
  }
}

export async function searchAIUseCases(industry: string): Promise<ExaSearchResult[]> {
  try {
    const response = await exa.searchAndContents(
      `Find AI use cases in ${industry}`,
      {
        useAutoprompt: true,
        numResults: 3,
        text: true
      }
    );

    // Access the results from the SearchResponse
    const results = response.results || [];

    return results.map((result: ExaApiResponse) => ({
      title: result.title || '',
      content: result.text || '',
      url: result.url || ''
    }));
  } catch (error) {
    console.error('Error fetching AI use cases:', error);
    return [];
  }
}
