import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DocumentState, BusinessDetails, TeamDetails, BusinessOverview, AuditAnswer } from './types';

interface DocumentStore extends DocumentState {
  businessDetails: BusinessDetails | null;
  teamDetails: TeamDetails | null;
  auditAnswers: AuditAnswer[];
  overview: BusinessOverview | null;
  setDocument: (document: string) => void;
  setError: (error: string | null) => void;
  setGenerationStatus: (status: DocumentState['generationStatus']) => void;
  setBusinessDetails: (details: BusinessDetails) => void;
  setTeamDetails: (details: TeamDetails) => void;
  setAuditAnswers: (answers: AuditAnswer[]) => void;
  setOverview: (overview: BusinessOverview) => void;
  reset: () => void;
}

const initialState = {
  currentDocument: null,
  generationStatus: 'idle' as const,
  error: null,
  businessDetails: null,
  teamDetails: null,
  auditAnswers: [],
  overview: null,
};

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set) => ({
      ...initialState,
      setDocument: (document) => 
        set({ currentDocument: document, generationStatus: 'success' as const }),
      setError: (error) => 
        set({ error, generationStatus: 'error' as const }),
      setGenerationStatus: (status) => 
        set({ generationStatus: status }),
      setBusinessDetails: (details) => 
        set({ businessDetails: details }),
      setTeamDetails: (details) => 
        set({ teamDetails: details }),
      setAuditAnswers: (answers) => 
        set({ auditAnswers: answers }),
      setOverview: (overview) => 
        set({ overview }),
      reset: () => set(initialState),
    }),
    {
      name: 'document-store',
    }
  )
);
