import Exa from 'exa-js';

if (!process.env.EXA_API_KEY) {
  throw new Error('Missing EXA_API_KEY environment variable');
}

const exa = new Exa(process.env.EXA_API_KEY);

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
  const query = `${industry} industry AI adoption trends and insights`;
  const response = await exa.search(query, { numResults: 3 });
  const results = response.results || [];
  
  return results.map(result => ({
    title: result.title || 'Untitled',
    content: result.text,
    url: result.url
  }));
}

export async function searchCompanyInfo(companyName: string): Promise<ExaSearchResult[]> {
  const query = `${companyName} company information and technology stack`;
  const response = await exa.search(query, { numResults: 3 });
  const results = response.results || [];
  
  return results.map(result => ({
    title: result.title || 'Untitled',
    content: result.text,
    url: result.url
  }));
}

export async function searchAIUseCases(industry: string): Promise<ExaSearchResult[]> {
  const query = `${industry} industry AI use cases and implementation examples`;
  const response = await exa.search(query, { numResults: 3 });
  const results = response.results || [];
  
  return results.map(result => ({
    title: result.title || 'Untitled',
    content: result.text,
    url: result.url
  }));
}
