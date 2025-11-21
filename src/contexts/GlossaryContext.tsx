import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import glossaryData from '../data/glossary_new';

export type GlossaryCategory = 'planets' | 'zodiac_signs' | 'houses' | 'aspects' | 'view_modes' | 'interface_concepts';

export interface GlossaryItem {
  name?: string;
  term?: string;
  number?: number;
  archetype_name?: string;
  archetype_figure_name?: string;
  essence?: string;
  keywords?: string[];
  origin_notes?: string;
  design_logic?: string;
  queer_theory_links?: string;
  crosscultural_resonances?: string[];
  project_rationale?: string;
  user_definition?: string;
  description?: string;
  traditional_name?: string;
  traditional_equivalent?: string;
  fusion_label?: string;
  element?: string;
  modality?: string;
  polarity?: string;
  angle?: number;
  orb?: number;
  purpose?: string;
  ui_elements?: string[];
  examples?: string[];
}

interface GlossaryContextType {
  glossaryData: typeof glossaryData;
  openItem: { category: GlossaryCategory; index: number } | null;
  setOpenItem: (item: { category: GlossaryCategory; index: number } | null) => void;
  updateUserDefinition: (category: GlossaryCategory, index: number, definition: string) => void;
  getItemByName: (category: GlossaryCategory, name: string) => GlossaryItem | undefined;
}

const GlossaryContext = createContext<GlossaryContextType | null>(null);

export function GlossaryProvider({ children }: { children: React.ReactNode }) {
  const [localGlossary, setLocalGlossary] = useState(glossaryData);
  const [openItem, setOpenItem] = useState<{ category: GlossaryCategory; index: number } | null>(null);

  // Load user definitions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('celestial-glossary-user-definitions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLocalGlossary((prev) => {
          const updated = { ...prev };
          Object.keys(parsed).forEach((category) => {
            if (updated[category as GlossaryCategory]) {
              updated[category as GlossaryCategory] = (updated[category as GlossaryCategory] as any[]).map((item, idx) => ({
                ...item,
                user_definition: parsed[category][idx] || item.user_definition,
              }));
            }
          });
          return updated;
        });
      } catch (e) {
        console.error('Failed to parse glossary definitions from localStorage', e);
      }
    }
  }, []);

  const updateUserDefinition = useCallback((category: GlossaryCategory, index: number, definition: string) => {
    setLocalGlossary((prev) => {
      const updated = { ...prev };
      const items = updated[category] as any[];
      if (items && items[index]) {
        items[index] = { ...items[index], user_definition: definition };
      }
      
      // Save to localStorage
      const userDefs: any = {};
      Object.keys(updated).forEach((cat) => {
        if (Array.isArray(updated[cat as GlossaryCategory])) {
          userDefs[cat] = (updated[cat as GlossaryCategory] as any[]).map((item) => item.user_definition || '');
        }
      });
      localStorage.setItem('celestial-glossary-user-definitions', JSON.stringify(userDefs));
      
      return updated;
    });
  }, []);

  const getItemByName = useCallback((category: GlossaryCategory, name: string): GlossaryItem | undefined => {
    const items = localGlossary[category] as any[];
    return items?.find((item: any) => 
      item.name === name || 
      item.term === name ||
      (item.number !== undefined && item.number === parseInt(name))
    );
  }, [localGlossary]);

  return (
    <GlossaryContext.Provider
      value={{
        glossaryData: localGlossary,
        openItem,
        setOpenItem,
        updateUserDefinition,
        getItemByName,
      }}
    >
      {children}
    </GlossaryContext.Provider>
  );
}

export function useGlossary() {
  const context = useContext(GlossaryContext);
  if (!context) {
    throw new Error('useGlossary must be used within GlossaryProvider');
  }
  return context;
}