'use client';

/**
 * Hooks de depuración para Field Mapper V3
 * 
 * Este archivo centraliza todos los hooks de depuración utilizados en Field Mapper V3,
 * proporcionando una interfaz unificada para acceder a las funcionalidades de diagnóstico.
 */

import { getFieldMapperDebugger } from './field-mapper-debugger';
import { getValidationDebugger } from './field-mapper-validation-debugger';
import { 
  NotionComponent, 
  PageComponent, 
  ComponentMapping 
} from './types';

// Re-exportar hooks y funciones para mantener compatibilidad
export const useFieldMapperDebugger = () => getFieldMapperDebugger();
export const useValidationDebugger = () => getValidationDebugger();

// Mock del estado para el Field Mapper V3
interface FieldMapperV3State {
  notionAssets: NotionComponent[];
  pageStructure: PageComponent[];
  mappings: ComponentMapping[];
  selectedNotionAssetId: string | null;
  selectedPageSectionId: string | null;
  validationResults: {
    isValid: boolean;
    errors: Array<{
      id: string;
      sectionId: string;
      fieldId: string;
      message: string;
      level: string;
    }>
  } | null;
}

// Implementación simple del store para Field Mapper V3
export const useFieldMapperV3Store = () => {
  const mockState: FieldMapperV3State = {
    notionAssets: [],
    pageStructure: [],
    mappings: [],
    selectedNotionAssetId: null,
    selectedPageSectionId: null,
    validationResults: null
  };
  
  return {
    ...mockState,
    getState: () => mockState,
    setState: () => {},
    subscribe: () => () => {},
  };
};

// Función para capturar el estado del Field Mapper
export const captureFieldMapperState = (
  component: string,
  state: Record<string, unknown>
) => {
  const debugInstance = getFieldMapperDebugger();
  if (typeof debugInstance.captureState === 'function') {
    debugInstance.captureState(component, state);
  } else {
    console.warn('captureState no está disponible en el debugger');
    debugInstance.captureError(
      component,
      'Intento de capturar estado sin método captureState disponible',
      'low'
    );
  }
};
