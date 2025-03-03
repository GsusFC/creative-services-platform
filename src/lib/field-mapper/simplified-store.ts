import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Field, FieldMapping, FieldMapperState, ValidationResult } from './simplified-types';

// Función de validación simple
const validateMapping = (
  notionField?: Field,
  websiteField?: Field
): ValidationResult => {
  if (!notionField || !websiteField) {
    return { isValid: false, error: 'Campos no seleccionados' };
  }

  // Matriz simple de compatibilidad
  const compatibilityMap: Record<string, string[]> = {
    'text': ['text', 'select', 'multiselect'],
    'number': ['number'],
    'boolean': ['boolean'],
    'date': ['date'],
    'select': ['text', 'select'],
    'multiselect': ['text', 'multiselect'],
    'image': ['image', 'file'],
    'file': ['file', 'image']
  };

  const isCompatible = compatibilityMap[notionField.type]?.includes(websiteField.type) || false;

  if (isCompatible) {
    return { isValid: true };
  }

  return {
    isValid: false,
    error: `El tipo "${notionField.type}" no es compatible con "${websiteField.type}"`,
    details: {
      compatibleTypes: compatibilityMap[notionField.type] || [],
      suggestion: 'Considera usar un campo con tipo compatible o añadir una transformación'
    }
  };
};

// Creación del store
export const useFieldMapperStore = create<FieldMapperState & {
  // Acciones
  addField: (field: Field) => void;
  removeField: (id: string) => void;
  addMapping: (notionFieldId: string, websiteFieldId: string) => void;
  removeMapping: (id: string) => void;
  updateMapping: (id: string, updates: Partial<FieldMapping>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAll: () => void;
}>(
  persist(
    (set, get) => ({
      // Estado inicial
      fields: [],
      mappings: [],
      loading: false,
      error: null,

      // Acciones
      addField: (field) => {
        set((state) => ({
          fields: [...state.fields, field]
        }));
      },

      removeField: (id) => {
        set((state) => ({
          fields: state.fields.filter(field => field.id !== id),
          mappings: state.mappings.filter(mapping => 
            mapping.notionFieldId !== id && mapping.websiteFieldId !== id
          )
        }));
      },

      addMapping: (notionFieldId, websiteFieldId) => {
        const { fields } = get();
        const notionField = fields.find(f => f.id === notionFieldId && f.source === 'notion');
        const websiteField = fields.find(f => f.id === websiteFieldId && f.source === 'website');
        
        const validation = validateMapping(notionField, websiteField);
        
        set((state) => ({
          mappings: [
            ...state.mappings,
            {
              id: `${notionFieldId}-${websiteFieldId}`,
              notionFieldId,
              websiteFieldId,
              validation
            }
          ]
        }));
      },

      removeMapping: (id) => {
        set((state) => ({
          mappings: state.mappings.filter(mapping => mapping.id !== id)
        }));
      },

      updateMapping: (id, updates) => {
        set((state) => ({
          mappings: state.mappings.map(mapping => 
            mapping.id === id ? { ...mapping, ...updates } : mapping
          )
        }));
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      clearAll: () => {
        set({
          fields: [],
          mappings: [],
          error: null
        });
      }
    }),
    {
      name: 'field-mapper-storage',
      partialize: (state) => ({ 
        fields: state.fields,
        mappings: state.mappings 
      })
    }
  )
);
