/**
 * Field Mapper Validation Worker
 * 
 * This worker handles type validation operations off the main thread
 * to prevent UI blocking during complex validation operations.
 */

import { typeCompatibilityMap } from './validation';
import { NotionFieldType, WebsiteFieldType } from './types';

// Define message types
type ValidationRequest = {
  type: 'validateTypeCompatibility';
  notionType: string;
  websiteType: string;
};

type ValidationResponse = {
  type: 'validationResult';
  result: {
    isValid: boolean;
    error?: string;
    suggestion?: string;
    details?: Record<string, unknown>;
  };
};

// Type guard for Notion field types
function isValidNotionType(type: string): type is NotionFieldType {
  return [
    'title', 'richText', 'number', 'select', 'multi_select', 
    'date', 'people', 'files', 'checkbox', 'url', 'email', 
    'phone_number', 'formula', 'relation', 'rollup', 'created_time', 
    'created_by', 'last_edited_time', 'last_edited_by', 'status',
    'unique_id', 'button', 'external'
  ].includes(type);
}

// Type guard for website field types
function isValidWebsiteType(type: string): type is WebsiteFieldType {
  return ['text', 'array', 'image', 'date', 'number', 'boolean', 'url'].includes(type);
}

// Check if a Notion field type is compatible with a website field type
function isTypeCompatible(notionType: string, websiteType: string): boolean {
  try {
    const normalizedNotionType = notionType as NotionFieldType;
    const normalizedWebsiteType = websiteType as WebsiteFieldType;
    
    if (!isValidNotionType(normalizedNotionType) || !isValidWebsiteType(normalizedWebsiteType)) {
      return false;
    }
    
    const compatibleTypes = typeCompatibilityMap[normalizedWebsiteType];
    return compatibleTypes ? compatibleTypes.includes(normalizedNotionType) : false;
  } catch (error) {
    console?.error('Error in isTypeCompatible:', error);
    return false;
  }
}

// Validate type compatibility between a Notion field type and a website field type
function validateTypeCompatibility(
  notionType: string, 
  websiteType: string
): { isValid: boolean; error?: string; suggestion?: string; details?: Record<string, unknown> } {
  try {
    // Handle empty inputs
    if (!notionType || !websiteType) {
      return {
        isValid: false,
        error: 'Tipos de campo no especificados'
      };
    }
    
    // Normalize types to lowercase
    const normalizedNotionType = notionType?.toLowerCase();
    const normalizedWebsiteType = websiteType?.toLowerCase();
    
    // Check compatibility
    const compatible = isTypeCompatible(normalizedNotionType, normalizedWebsiteType);
    
    if (compatible) {
      return {
        isValid: true,
        details: {
          notionType: normalizedNotionType,
          websiteType: normalizedWebsiteType
        }
      };
    }
    
    return {
      isValid: false,
      error: `El tipo "${normalizedNotionType}" de Notion no es compatible con el tipo "${normalizedWebsiteType}" del sitio web`,
      details: {
        notionType: normalizedNotionType,
        websiteType: normalizedWebsiteType,
        compatibleTypes: isValidWebsiteType(normalizedWebsiteType) 
          ? typeCompatibilityMap[normalizedWebsiteType] || [] 
          : []
      }
    };
  } catch (error) {
    console?.error('Error in validateTypeCompatibility:', error);
    return {
      isValid: false,
      error: 'Error al validar la compatibilidad de tipos',
      details: { error: String(error) }
    };
  }
}

// Set up worker message handler
self?.addEventListener('message', (event: MessageEvent<ValidationRequest>) => {
  const { type, notionType, websiteType } = event.data;
  
  if (type === 'validateTypeCompatibility') {
    const result = validateTypeCompatibility(notionType, websiteType);
    
    const response: ValidationResponse = {
      type: 'validationResult',
      result
    };
    
    self?.postMessage(response);
  }
});

// Export null to satisfy TypeScript module requirements
export {};
