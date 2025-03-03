// Archivo simplificado para permitir el despliegue

// Mock store simple
import { create } from 'zustand';

// Tipos básicos
export interface FieldMapping {
  id: string;
  notionField: string;
  websiteField: string;
  notionType: string;
  websiteType: string;
}

export interface Field {
  id: string;
  name: string;
  type: string;
  source: 'notion' | 'website';
}

// Store simplificado que no causa errores de TypeScript
interface SimplifiedStore {
  mappings: FieldMapping[];
  websiteFields: Field[];
  notionFields: Field[];
  isLoading: boolean;
  error: string | null;
  
  // Funciones simuladas
  setMappings: (mappings: FieldMapping[]) => void;
  setNotionFields: (fields: Field[]) => void;
  setWebsiteFields: (fields: Field[]) => void;
  clearMappings: () => void;
}

// Creación del store simplificado
export const useFieldMapperStore = create<SimplifiedStore>()((set) => ({
  // Estado inicial
  mappings: [],
  websiteFields: [],
  notionFields: [],
  isLoading: false,
  error: null,
  
  // Implementaciones simuladas de las funciones
  setMappings: (mappings) => set({ mappings }),
  setNotionFields: (fields) => set({ notionFields: fields }),
  setWebsiteFields: (fields) => set({ websiteFields: fields }),
  clearMappings: () => set({ mappings: [] })
}));
