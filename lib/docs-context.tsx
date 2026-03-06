'use client';

import { createContext, useContext } from 'react';

interface DocsContextValue {
  openDocs: (section?: string) => void;
}

export const DocsContext = createContext<DocsContextValue>({ openDocs: () => {} });
export const useDocs = () => useContext(DocsContext);
