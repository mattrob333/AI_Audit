import { DocumentType } from '@/lib/types';

const documentSteps: Array<{
  id: DocumentType;
  title: string;
  description: string;
}> = [
  {
    id: 'executiveSummary',
    title: 'Executive Summary',
    description: 'High-level overview of your business and AI implementation strategy'
  },
  {
    id: 'upskilling',
    title: 'Upskilling Documents',
    description: 'Training documents for team skill development'
  },
  {
    id: 'aiPersonas',
    title: 'AI Personas',
    description: 'Four AI personas for Marketing, Sales, Operations, and Research'
  },
  {
    id: 'customerChatbot',
    title: 'Customer-Facing Chatbot',
    description: 'Chatbot configuration and knowledge base'
  },
  {
    id: 'automationPlan',
    title: 'Automation Plan',
    description: 'Custom software automations and AI integration roadmap'
  }
];

export { documentSteps };
