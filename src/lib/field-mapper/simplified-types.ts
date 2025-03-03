/**
 * Tipos simplificados para Field Mapper
 * 
 * Versión optimizada con solo los tipos esenciales para el funcionamiento básico
 */

// Tipos básicos de campos
export type FieldType = 'text' | 'number' | 'boolean' | 'date' | 'select' | 'multiselect' | 'image' | 'file';

// Campo genérico
export interface Field {
  id: string;
  name: string;
  type: FieldType;
  required?: boolean;
  source: 'notion' | 'website';
}

// Validación
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  details?: {
    compatibleTypes?: string[];
    suggestion?: string;
  };
}

// Mapeo de campos
export interface FieldMapping {
  id: string;
  notionFieldId: string;
  websiteFieldId: string;
  transformation?: string;
  validation?: ValidationResult;
}

// Estado simplificado
export interface FieldMapperState {
  fields: Field[];
  mappings: FieldMapping[];
  loading: boolean;
  error: string | null;
}
