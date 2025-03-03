/**
 * Tipos y interfaces para el sistema de depuración
 * 
 * Este archivo centraliza todos los tipos utilizados en el sistema de depuración,
 * asegurando consistencia en toda la aplicación.
 */

// Tipos básicos para componentes
export interface ComponentField {
  id: string;
  name: string;
  type: string;
  required: boolean;
}

export interface NotionComponent {
  id: string;
  name: string;
  type: string;
  fields: ComponentField[];
}

export interface PageComponent extends NotionComponent {
  description: string;
}

export interface ComponentMapping {
  id: string;
  pageComponentId: string;
  notionComponentId: string;
  fieldMappings: Array<{
    pageFieldId: string;
    notionFieldId: string;
  }>;
}

// Tipos para el sistema de depuración
export type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface DebugError {
  id: string;
  timestamp: number;
  component: string;
  message: string;
  stack?: string;
  severity: ErrorSeverity;
  count: number;
  lastOccurrence: number;
  metadata?: Record<string, unknown>;
}

export interface ValidationResult {
  valid: boolean;
  errors: Array<{
    message: string;
    fieldId?: string;
    suggestion?: string;
  }>;
}

// Exportar tipos de componentes UI para el panel de depuración
export interface DebugPanelProps {
  initialVisible?: boolean;
}

export interface ValidationDebuggerInstance {
  validateMapping: (mapping: ComponentMapping) => ValidationResult;
  validateField: (field: ComponentField, targetField: ComponentField) => boolean;
  getLastValidationResult: () => ValidationResult | null;
}

export type FieldMapperDebuggerInstance = {
  captureError: (
    component: string,
    message: string,
    severity: ErrorSeverity,
    metadata?: Record<string, unknown>
  ) => void;
  captureState: (component: string, state: Record<string, unknown>) => void;
  getErrors: () => DebugError[];
  clearErrors: () => void;
  enableConsoleCapture: () => void;
  disableConsoleCapture: () => void;
};
