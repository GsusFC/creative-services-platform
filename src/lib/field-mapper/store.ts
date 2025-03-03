import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { validateTypeCompatibility } from './validation'
import { NotionFieldType, WebsiteFieldType, FieldMapping, Field, ValidationResult } from './types'
import { v4 as uuidv4 } from 'uuid';

// Re-export FieldMapping para que pueda ser importado desde este archivo
export type { FieldMapping, Field, ValidationResult } from './types';

// ValidationError interface for internal use
interface ValidationError {
  websiteField: string;
  notionField: string;
  websiteType: string;
  notionType: string;
  warning: string;
  suggestion?: string;
}

interface FieldMapperState {
  // Core state
  mappings: FieldMapping[]
  websiteFields: Field[]
  notionFields: Field[]
  
  // UI state
  isLoading: boolean
  error: string | null
  isValid: boolean
  validationErrors: Record<string, string>
  lastValidated: number
}

interface FieldMapperActions {
  // Actions
  setNotionFields: (fields: Field[]) => void
  setWebsiteFields: (fields: Field[]) => void
  setMappings: (mappings: FieldMapping[]) => void
  addMapping: (mapping: { notionField: string, websiteField: string, websiteType?: string, notionType?: string }) => void
  updateMapping: (index: number, mapping: FieldMapping) => void
  removeMapping: (index: number) => void
  validateMappings: () => { isValid: boolean; errors: ValidationError[] }
  clearMappings: () => void
  setError: (error: string | null) => void
  setLoading: (isLoading: boolean) => void
}

type StoreType = FieldMapperState & FieldMapperActions;

// Helpers for validation
const VALIDATION_THROTTLE = 500; // ms

const validateMappingStructure = (mapping: FieldMapping): boolean => {
  if (!mapping || typeof mapping !== 'object') return false;
  if (typeof mapping.notionField !== 'string') return false;
  if (typeof mapping.websiteField !== 'string') return false;
  
  // Optional fields with defaults
  if (!mapping.notionType) mapping.notionType = 'unknown';
  if (!mapping.websiteType) mapping.websiteType = 'unknown';
  if (!mapping.id) mapping.id = uuidv4();
  
  return true;
}

// Memoization utility to avoid repeating expensive validations
const memoize = <T, R>(fn: (arg: T) => R): ((arg: T) => R) => {
  const cache = new Map<string, R>();
  return (arg: T) => {
    const key = JSON.stringify(arg);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(arg);
    cache.set(key, result);
    if (cache.size > 100) { // Prevent unbounded growth
      cache.delete(cache.keys().next().value);
    }
    return result;
  };
};

// Memoized validation function
const memoizedValidateTypeCompatibility = memoize(
  (types: { notionType: string; websiteType: string }) => {
    return validateTypeCompatibility(types.notionType, types.websiteType);
  }
);

export const useFieldMapperStore = create<StoreType>()(
  persist(
    (set, get) => ({
      // Initial state
      mappings: [],
      websiteFields: [],
      notionFields: [],
      isLoading: false,
      error: null,
      isValid: true,
      validationErrors: {},
      lastValidated: 0,

      // Actions
      setNotionFields: (fields: Field[]) => {
        set((state: StoreType) => ({ 
          notionFields: fields || [],
          // If we update fields, we need to revalidate
          lastValidated: 0
        }));
      },
      
      setWebsiteFields: (fields: Field[]) => {
        set((state: StoreType) => ({ 
          websiteFields: fields || [],
          // If we update fields, we need to revalidate
          lastValidated: 0
        }));
      },
      
      setLoading: (isLoading: boolean) => set({ isLoading }),
      
      setError: (error: string | null) => set({ error }),
      
      setMappings: (mappings: FieldMapping[]) => {
        console.log('Setting mappings:', mappings?.length || 0);
        
        try {
          // Safety checks
          if (!mappings || !Array.isArray(mappings)) {
            console.error('Invalid mappings format:', typeof mappings);
            set({ error: 'Invalid mappings format', mappings: [] });
            return;
          }
          
          // Validate and clean mappings
          const validMappings = mappings
            .filter(m => validateMappingStructure(m))
            .map(m => ({
              ...m,
              id: m.id || uuidv4() // Ensure ID exists
            }));
          
          set((state: StoreType) => ({ 
            mappings: validMappings,
            // Reset validation when we set new mappings
            validationErrors: {},
            lastValidated: 0
          }));
          
          // Don't trigger validation here to prevent cascading updates
          // Validation will happen next render cycle if needed
        } catch (err) {
          console.error('Error in setMappings:', err);
          set({ 
            error: `Failed to set mappings: ${err instanceof Error ? err.message : 'Unknown error'}`,
            mappings: [] 
          });
        }
      },
      
      addMapping: (mapping: { notionField: string, websiteField: string, websiteType?: string, notionType?: string }) => {
        try {
          // Get field types if not provided
          const { websiteFields, notionFields } = get();
          
          const actualWebsiteType = mapping.websiteType || 
            websiteFields.find(f => f.id === mapping.websiteField)?.type || 
            'unknown';
          
          const actualNotionType = mapping.notionType || 
            notionFields.find(f => f.id === mapping.notionField)?.type || 
            'unknown';
          
          // Check for duplicates
          const { mappings } = get();
          
          // Create new mapping
          const newMapping: FieldMapping = {
            id: uuidv4(),
            notionField: mapping.notionField,
            websiteField: mapping.websiteField,
            notionType: actualNotionType,
            websiteType: actualWebsiteType,
          };
          
          // Validate the new mapping
          const validation = memoizedValidateTypeCompatibility({
            notionType: actualNotionType,
            websiteType: actualWebsiteType
          });
          
          newMapping.validation = validation;
          
          // Update state - use callback form for atomic updates
          set((state: StoreType) => {
            const newMappings = [...state.mappings, newMapping];
            return { 
              mappings: newMappings,
              // Add to validation errors if invalid
              validationErrors: {
                ...state.validationErrors,
                ...(validation.isValid ? {} : { [mapping.websiteField]: validation.warning || 'Type validation failed' })
              }
            };
          });
          
        } catch (err) {
          console.error('Error in addMapping:', err);
          set({ error: `Failed to add mapping: ${err instanceof Error ? err.message : 'Unknown error'}` });
        }
      },
      
      updateMapping: (index: number, mapping: FieldMapping) => {
        try {
          // Validate the updated mapping
          const validation = memoizedValidateTypeCompatibility({
            notionType: mapping.notionType,
            websiteType: mapping.websiteType
          });
          
          // Update the mapping with validation info
          const updatedMapping = {
            ...mapping,
            validation
          };
          
          // Use callback to ensure atomic updates
          set((state: StoreType) => {
            // Prevent out of bounds or invalid indexes
            if (index < 0 || index >= state.mappings.length) {
              console.error(`Invalid index: ${index}, mappings length: ${state.mappings.length}`);
              return state;
            }
            
            // Create a new array with the updated mapping
            const newMappings = [...state.mappings];
            newMappings[index] = updatedMapping;
            
            // Update validation errors
            const newValidationErrors = { ...state.validationErrors };
            
            if (validation.isValid) {
              // Remove error if it exists
              delete newValidationErrors[mapping.websiteField];
            } else {
              // Add/update the error
              newValidationErrors[mapping.websiteField] = validation.warning || 'Type validation failed';
            }
            
            return {
              mappings: newMappings,
              validationErrors: newValidationErrors
            };
          });
          
        } catch (err) {
          console.error('Error in updateMapping:', err);
          set({ error: `Failed to update mapping: ${err instanceof Error ? err.message : 'Unknown error'}` });
        }
      },
      
      removeMapping: (index: number) => {
        try {
          // Use callback to ensure atomic updates
          set((state: StoreType) => {
            // Prevent out of bounds
            if (index < 0 || index >= state.mappings.length) {
              console.error(`Invalid index: ${index}, mappings length: ${state.mappings.length}`);
              return state;
            }
            
            // Get the mapping to remove
            const mappingToRemove = state.mappings[index];
            
            // Create new arrays without the mapping
            const newMappings = [...state.mappings];
            newMappings.splice(index, 1);
            
            // Remove any validation errors for this mapping
            const newValidationErrors = { ...state.validationErrors };
            delete newValidationErrors[mappingToRemove.websiteField];
            
            return {
              mappings: newMappings,
              validationErrors: newValidationErrors
            };
          });
          
        } catch (err) {
          console.error('Error in removeMapping:', err);
          set({ error: `Failed to remove mapping: ${err instanceof Error ? err.message : 'Unknown error'}` });
        }
      },
      
      validateMappings: () => {
        try {
          console.log('Running mapping validation');
          const { mappings, websiteFields, lastValidated } = get();
          
          // Skip validation if we've recently validated (throttle)
          const now = Date.now();
          if (now - lastValidated < VALIDATION_THROTTLE) {
            console.log(`Skipping validation (throttled): last=${lastValidated}, now=${now}`);
            // Return the current validation state without recalculating
            const { isValid, validationErrors } = get();
            return {
              isValid,
              errors: Object.entries(validationErrors).map(([websiteField, warning]) => ({
                websiteField,
                notionField: mappings.find(m => m.websiteField === websiteField)?.notionField || '',
                websiteType: mappings.find(m => m.websiteField === websiteField)?.websiteType || '',
                notionType: mappings.find(m => m.websiteField === websiteField)?.notionType || '',
                warning,
                suggestion: ''
              }))
            };
          }
          
          const errors: ValidationError[] = [];
          const newValidationErrors: Record<string, string> = {};
          
          // Check for required website fields
          const requiredWebsiteFields = websiteFields.filter(f => f.required);
          
          for (const field of requiredWebsiteFields) {
            if (!mappings.some(m => m.websiteField === field.id)) {
              const error = {
                websiteField: field.id,
                notionField: '',
                websiteType: field.type,
                notionType: '',
                warning: `Required field ${field.name} is not mapped`,
                suggestion: ''
              };
              errors.push(error);
              newValidationErrors[field.id] = error.warning;
            }
          }
          
          // Check for duplicate website fields
          const websiteFieldCounts = mappings.reduce((acc, mapping) => {
            acc[mapping.websiteField] = (acc[mapping.websiteField] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          for (const [fieldId, count] of Object.entries(websiteFieldCounts)) {
            if (count > 1) {
              const fieldName = websiteFields.find(f => f.id === fieldId)?.name || fieldId;
              const error = {
                websiteField: fieldId,
                notionField: '',
                websiteType: '',
                notionType: '',
                warning: `Website field ${fieldName} is mapped multiple times (${count})`,
                suggestion: ''
              };
              errors.push(error);
              newValidationErrors[fieldId] = error.warning;
            }
          }
          
          // Check for type compatibility issues - use memoized function for performance
          const typeValidationIssues = mappings
            .filter(m => {
              const validation = memoizedValidateTypeCompatibility({
                notionType: m.notionType,
                websiteType: m.websiteType
              });
              return !validation.isValid;
            })
            .map(m => {
              const fieldName = websiteFields.find(f => f.id === m.websiteField)?.name || m.websiteField;
              const validation = memoizedValidateTypeCompatibility({
                notionType: m.notionType,
                websiteType: m.websiteType
              });
              const error = {
                websiteField: m.websiteField,
                notionField: m.notionField,
                websiteType: m.websiteType,
                notionType: m.notionType,
                warning: `Type compatibility issue with ${fieldName}: ${validation.warning}`,
                suggestion: validation.suggestion || ''
              };
              newValidationErrors[m.websiteField] = error.warning;
              return error;
            });
          
          errors.push(...typeValidationIssues);
          
          // Update store with validation results
          const newIsValid = errors.length === 0;
          
          // Use callback for atomic update
          set({ 
            isValid: newIsValid, 
            validationErrors: newValidationErrors,
            lastValidated: now
          });
          
          console.log(`Validation complete. Valid: ${newIsValid}, Errors: ${errors.length}`);
          
          return {
            isValid: newIsValid,
            errors
          };
        } catch (err) {
          console.error('Error in validateMappings:', err);
          
          // Update error state
          set({ 
            error: `Validation error: ${err instanceof Error ? err.message : 'Unknown error'}`,
            isValid: false
          });
          
          return {
            isValid: false,
            errors: [{
              websiteField: '',
              notionField: '',
              websiteType: '',
              notionType: '',
              warning: 'Validation function crashed, see console for details',
              suggestion: ''
            }]
          };
        }
      },
      
      clearMappings: () => {
        try {
          // Reset everything related to mappings
          set({ 
            mappings: [],
            validationErrors: {},
            isValid: true,
            error: null,
            lastValidated: 0
          });
        } catch (err) {
          console.error('Error in clearMappings:', err);
          set({ error: `Failed to clear mappings: ${err instanceof Error ? err.message : 'Unknown error'}` });
        }
      }
    }),
    {
      name: 'field-mapper-storage',
      storage: createJSONStorage(() => {
        // Safe localStorage wrapper with SSR check
        if (typeof window === 'undefined') {
          // Return a dummy storage for the server
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {}
          };
        }
        
        return {
          getItem(name) {
            try {
              const value = localStorage.getItem(name);
              return value ? JSON.parse(value) : null;
            } catch (err) {
              console.error(`Error reading from localStorage (${name}):`, err);
              return null;
            }
          },
          setItem(name, value) {
            try {
              localStorage.setItem(name, JSON.stringify(value));
            } catch (err) {
              console.error(`Error writing to localStorage (${name}):`, err);
            }
          },
          removeItem(name) {
            try {
              localStorage.removeItem(name);
            } catch (err) {
              console.error(`Error removing from localStorage (${name}):`, err);
            }
          }
        };
      }),
      // Only persist the mappings, not the entire state
      partialize: (state: StoreType) => ({ 
        mappings: state.mappings
      }),
      // Validate on hydration
      onRehydrateStorage: () => (state: StoreType) => {
        if (state) {
          console.log('Field mapper store rehydrated with', state.mappings?.length || 0, 'mappings');
          
          // Schedule validation for next cycle to avoid render issues
          setTimeout(() => {
            const { validateMappings } = state;
            if (validateMappings) {
              validateMappings();
            }
          }, 0);
        }
      }
    }
  )
);
