// Versión simplificada sin dependencia de zustand
// Utiliza un patrón de módulo JavaScript simple para almacenamiento

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

// Estado y funciones
const state = {
  mappings: [] as FieldMapping[],
  websiteFields: [] as Field[],
  notionFields: [] as Field[],
  isLoading: false,
  error: null as string | null,
};

// Funciones para actualizar el estado
const setMappings = (mappings: FieldMapping[]) => {
  state.mappings = mappings;
};

const setNotionFields = (fields: Field[]) => {
  state.notionFields = fields;
};

const setWebsiteFields = (fields: Field[]) => {
  state.websiteFields = fields;
};

const clearMappings = () => {
  state.mappings = [];
};

// Hook simulado que devuelve el estado y las funciones
export const useFieldMapperStore = () => {
  return {
    ...state,
    setMappings,
    setNotionFields,
    setWebsiteFields,
    clearMappings,
  };
};
