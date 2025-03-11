'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Design } from '../components/Gallery/GalleryContainer';

interface DesignContextType {
  selectedDesign: Design | null;
  setSelectedDesign: (design: Design | null) => void;
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

export function DesignProvider({ children }: { children: ReactNode }) {
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);

  return (
    <DesignContext.Provider value={{ selectedDesign, setSelectedDesign }}>
      {children}
    </DesignContext.Provider>
  );
}

export function useDesign() {
  const context = useContext(DesignContext);
  if (context === undefined) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
} 