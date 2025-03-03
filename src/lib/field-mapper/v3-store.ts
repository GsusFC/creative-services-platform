/**
 * Field Mapper V3 - Store
 * 
 * Store basado en Zustand para gestionar el estado del Field Mapper V3.
 * Se enfoca en landing pages para Case Studies con un enfoque de mapeo 
 * directo entre assets de Notion y la estructura predefinida de la landing.
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { v4 as uuidv4 } from 'uuid'
import { NotionComponent, PageComponent, ComponentMapping, CASE_STUDY_COMPONENTS } from './v3-types'
import { validateFieldCompatibility, ComponentCompatibilityLevel } from './v3-validation'

// Interfaces del store
interface FieldMapperV3State {
  // Datos principales
  notionAssets: NotionComponent[];
  pageStructure: PageComponent[];
  mappings: ComponentMapping[];
  
  // Estado de la UI
  selectedNotionAssetId: string | null;
  selectedPageSectionId: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Estado de validación
  validationResults: {
    isValid: boolean;
    errors: { 
      sectionId: string;
      fieldId: string;
      message: string;
      level: ComponentCompatibilityLevel;
    }[];
  };
}

interface FieldMapperV3Actions {
  // Acciones para cargar datos
  setNotionAssets: (assets: NotionComponent[]) => void;
  setPageStructure: (structure: PageComponent[]) => void;
  
  // Acciones para gestionar mappings
  setMappings: (mappings: ComponentMapping[]) => void;
  addMapping: (mapping: Omit<ComponentMapping, 'id'>) => void;
  updateMapping: (id: string, mapping: Partial<ComponentMapping>) => void;
  removeMapping: (id: string) => void;
  clearMappings: () => void;
  
  // Acciones de UI
  setSelectedNotionAsset: (id: string | null) => void;
  setSelectedPageSection: (id: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Acciones de validación
  validateMappings: () => void;
}

// Tipo del store completo
type FieldMapperV3Store = FieldMapperV3State & FieldMapperV3Actions;

// Función para validar un mapping específico
const validateMapping = (
  mapping: ComponentMapping, 
  pageStructure: PageComponent[], 
  notionAssets: NotionComponent[]
): { 
  isValid: boolean; 
  errors: { 
    sectionId: string; 
    fieldId: string; 
    message: string; 
    level: ComponentCompatibilityLevel;
  }[] 
} => {
  const errors: { 
    sectionId: string; 
    fieldId: string; 
    message: string; 
    level: ComponentCompatibilityLevel;
  }[] = [];
  
  // Encontrar los componentes mapeados
  const pageComponent = pageStructure.find(c => c.id === mapping.pageComponentId);
  const notionComponent = notionAssets.find(c => c.id === mapping.notionComponentId);
  
  // Si no se encuentran los componentes, el mapping no es válido
  if (!pageComponent || !notionComponent) {
    return {
      isValid: false,
      errors: [{
        sectionId: mapping.pageComponentId,
        fieldId: '',
        message: 'No se encontraron los componentes mapeados',
        level: ComponentCompatibilityLevel.ERROR
      }]
    };
  }

  // Validar cada mapeo de campo
  for (const fieldMapping of mapping.fieldMappings) {
    const pageField = pageComponent.fields.find(f => f.id === fieldMapping.pageFieldId);
    const notionField = notionComponent.fields.find(f => f.id === fieldMapping.notionFieldId);
    
    // Si no se encuentra alguno de los campos, agregar error
    if (!pageField || !notionField) {
      errors.push({
        sectionId: mapping.pageComponentId,
        fieldId: fieldMapping.pageFieldId || '',
        message: 'Campo no encontrado',
        level: ComponentCompatibilityLevel.ERROR
      });
      continue;
    }
    
    // Validar compatibilidad entre los tipos de campos
    const compatibility = validateFieldCompatibility(notionField.type, pageField.type);
    
    if (compatibility.level !== ComponentCompatibilityLevel.COMPATIBLE) {
      errors.push({
        sectionId: mapping.pageComponentId,
        fieldId: fieldMapping.pageFieldId,
        message: compatibility.message,
        level: compatibility.level
      });
    }
  }
  
  // Verificar campos requeridos que no están mapeados
  for (const pageField of pageComponent.fields) {
    if (pageField.required) {
      const isMapped = mapping.fieldMappings.some(fm => fm.pageFieldId === pageField.id);
      if (!isMapped) {
        errors.push({
          sectionId: mapping.pageComponentId,
          fieldId: pageField.id,
          message: 'Campo requerido no mapeado',
          level: ComponentCompatibilityLevel.ERROR
        });
      }
    }
  }
  
  return {
    isValid: errors.filter(e => e.level === ComponentCompatibilityLevel.ERROR).length === 0,
    errors
  };
};

// Crear el store
export const useFieldMapperV3Store = create<FieldMapperV3Store>()(
  persist(
    (set, get) => ({
      // Estado inicial
      notionAssets: [],
      pageStructure: CASE_STUDY_COMPONENTS,
      mappings: [],
      selectedNotionAssetId: null,
      selectedPageSectionId: null,
      isLoading: false,
      error: null,
      validationResults: {
        isValid: true,
        errors: []
      },
      
      // Acciones para cargar datos
      setNotionAssets: (assets) => set({ notionAssets: assets }),
      setPageStructure: (structure) => set({ pageStructure: structure }),
      
      // Acciones para gestionar mappings
      setMappings: (mappings) => {
        set({ mappings });
        // Validar inmediatamente después de establecer los mappings
        get().validateMappings();
      },
      
      addMapping: (mapping) => {
        const newMapping: ComponentMapping = {
          ...mapping,
          id: uuidv4(),
          fieldMappings: mapping.fieldMappings || []
        };
        
        set(state => ({
          mappings: [...state.mappings, newMapping]
        }));
        
        // Validar inmediatamente después de agregar un mapping
        get().validateMappings();
      },
      
      updateMapping: (id, updatedMapping) => {
        set(state => ({
          mappings: state.mappings.map(m => 
            m.id === id ? { ...m, ...updatedMapping } : m
          )
        }));
        
        // Validar inmediatamente después de actualizar un mapping
        get().validateMappings();
      },
      
      removeMapping: (id) => {
        set(state => ({
          mappings: state.mappings.filter(m => m.id !== id)
        }));
        
        // Validar inmediatamente después de eliminar un mapping
        get().validateMappings();
      },
      
      clearMappings: () => {
        set({ mappings: [] });
        
        // Resetear validación
        set({
          validationResults: {
            isValid: true,
            errors: []
          }
        });
      },
      
      // Acciones de UI
      setSelectedNotionAsset: (id) => set({ selectedNotionAssetId: id }),
      setSelectedPageSection: (id) => set({ selectedPageSectionId: id }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      
      // Acciones de validación
      validateMappings: () => {
        const state = get();
        const allErrors: {
          sectionId: string;
          fieldId: string;
          message: string;
          level: ComponentCompatibilityLevel;
        }[] = [];
        
        // Validar cada mapping
        for (const mapping of state.mappings) {
          const result = validateMapping(
            mapping, 
            state.pageStructure, 
            state.notionAssets
          );
          
          allErrors.push(...result.errors);
        }
        
        // Actualizar resultados de validación
        set({
          validationResults: {
            isValid: allErrors.filter(e => e.level === ComponentCompatibilityLevel.ERROR).length === 0,
            errors: allErrors
          }
        });
      }
    }),
    {
      name: 'field-mapper-v3-storage',
      storage: createJSONStorage(() => {
        // Safe localStorage wrapper con verificación de SSR
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => null,
            removeItem: () => null
          };
        }
        
        return {
          getItem: (name: string) => {
            try {
              const data = localStorage.getItem(name);
              return data ? JSON.parse(data) : null;
            } catch (error) {
              console.error('Error al obtener datos del localStorage', error);
              return null;
            }
          },
          setItem: (name: string, value: any) => {
            try {
              localStorage.setItem(name, JSON.stringify(value));
            } catch (error) {
              console.error('Error al guardar datos en localStorage', error);
            }
          },
          removeItem: (name: string) => {
            try {
              localStorage.removeItem(name);
            } catch (error) {
              console.error('Error al eliminar datos del localStorage', error);
            }
          }
        };
      }),
      // Solo persistir los mappings, no todo el estado
      partialize: (state) => ({
        mappings: state.mappings
      }),
      // Validar al rehidratar el store
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Validar mappings después de cargar desde storage
          setTimeout(() => {
            state.validateMappings();
          }, 0);
        }
      }
    }
  )
);
