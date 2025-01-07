import Exa from 'exa-js';

let exaClient: Exa | null = null;

function getExaClient(): Exa {
  if (!process.env.EXA_API_KEY) {
    throw new Error('Missing EXA_API_KEY environment variable');
  }

  if (!exaClient) {
    exaClient = new Exa(process.env.EXA_API_KEY);
  }

  return exaClient;
}

interface ExaSearchResponse {
  title: string;
  text: string;
  url: string;
}

export interface ExaSearchResult {
  title: string;
  content: string;
  url: string;
}

export async function searchIndustryInsights(industry: string): Promise<ExaSearchResult[]> {
  try {
    const query = `${industry} industry AI adoption trends and insights`;
    const response = await getExaClient().search(query, { numResults: 3 });
    const results = response.results || [];
    
    return results.map(result => ({
      title: result.title || 'Untitled',
      content: result.text,
      url: result.url
    }));
  } catch (error) {
    console.error('Error searching industry insights:', error);
    return [];
  }
}

export async function searchCompanyInfo(companyName: string): Promise<ExaSearchResult[]> {
  try {
    const query = `${companyName} company information and technology stack`;
    const response = await getExaClient().search(query, { numResults: 3 });
    const results = response.results || [];
    
    return results.map(result => ({
      title: result.title || 'Untitled',
      content: result.text,
      url: result.url
    }));
  } catch (error) {
    console.error('Error searching company info:', error);
    return [];
  }
}

export async function searchAIUseCases(industry: string): Promise<ExaSearchResult[]> {
  try {
    const query = `${industry} industry AI use cases and implementation examples`;
    const response = await getExaClient().search(query, { numResults: 3 });
    const results = response.results || [];
    
    return results.map(result => ({
      title: result.title || 'Untitled',
      content: result.text,
      url: result.url
    }));
  } catch (error) {
    console.error('Error searching AI use cases:', error);
    return [];
  }
}
