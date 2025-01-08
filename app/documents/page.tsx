'use client';

import { useState } from 'react';
import { DocumentGenerator } from '@/components/document-generator';
import { DocumentType } from '@/lib/types';

export default function DocumentsPage() {
  const [selectedDocument, setSelectedDocument] = useState<DocumentType>();

  return (
    <DocumentGenerator 
      selectedDocument={selectedDocument}
      setSelectedDocument={setSelectedDocument}
    />
  );
}
