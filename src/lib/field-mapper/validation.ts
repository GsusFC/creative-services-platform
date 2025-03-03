/**
 * Field Mapper Type Validation
 * 
 * This module provides utilities for validating field type compatibility
 * between Notion database fields and website fields.
 * Includes improved error handling and protection against invalid inputs.
 */

// Import field types from types.ts
import { WebsiteFieldType, NotionFieldType } from './types';

// Definimos el enum CompatibilityLevel aquí para evitar la importación circular
export enum CompatibilityLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

// Compatibility map defines which Notion field types can be mapped to which website field types
// Solo definimos los tipos básicos que necesitamos, no todos los de WebsiteFieldType
export const typeCompatibilityMap: Partial<Record<WebsiteFieldType, NotionFieldType[]>> = {
  'text': [
    'title', 'richText', 'select', 'url', 'email', 'phone_number', 
    'formula', 'created_by', 'last_edited_by', 'status'
  ],
  'array': [
    'multi_select', 'relation', 'people', 'files'
  ],
  'image': [
    'files', 'url'
  ],
  'date': [
    'date', 'created_time', 'last_edited_time'
  ],
  'number': [
    'number', 'formula'
  ],
  'boolean': [
    'checkbox'
  ],
  'url': [
    'url', 'richText', 'files'
  ]
};

// Suggested conversions for incompatible types
export const typeConversionSuggestions: Record<string, string> = {
  'title_to_array': 'Extract words from title with a split function',
  'rich_text_to_array': 'Extract words or paragraphs with a split function',
  'select_to_array': 'Wrap the single value in an array',
  'multi_select_to_text': 'Join array values with comma or other separator',
  'people_to_text': 'Extract name or email from people objects',
  'files_to_text': 'Extract file names or URLs',
  'number_to_text': 'Convert number to string',
  'date_to_text': 'Format date as a readable string',
  'checkbox_to_text': 'Convert to "Yes"/"No" or "True"/"False"',
  'relation_to_text': 'Extract related item titles',
  'files_to_url': 'Extract the first file URL',
  'rich_text_to_url': 'Extract URL from text if present',
};

/**
 * Check if a Notion field type is compatible with a website field type
 * 
 * @param notionType The Notion field type to check
 * @param websiteType The website field type to check against
 * @returns boolean indicating compatibility
 */
export function isTypeCompatible(
  notionType: NotionFieldType | string, 
  websiteType: WebsiteFieldType | string
): boolean {
  try {
    // Safety check for inputs
    if (!notionType || !websiteType) {
      console.error(`Invalid types: notionType=${notionType}, websiteType=${websiteType}`);
      return false;
    }
    
    // Normalize inputs
    const normalizedNotionType = notionType.toLowerCase().trim() as NotionFieldType;
    const normalizedWebsiteType = websiteType.toLowerCase().trim() as WebsiteFieldType;
    
    // Special cases for formula and rollup - need more context for accurate validation
    if (normalizedNotionType === 'formula' || normalizedNotionType === 'rollup') {
      // For rollup and formula, we need to know the output type
      // Since we don't have that information here, we'll be permissive
      // and let the user decide if the mapping makes sense
      return true;
    }
    
    // Check in compatibility map
    const compatibleNotionTypes = typeCompatibilityMap[normalizedWebsiteType];
    
    if (!compatibleNotionTypes) {
      console.warn(`Unknown website field type: ${normalizedWebsiteType}`);
      return false;
    }
    
    const isCompatible = compatibleNotionTypes.includes(normalizedNotionType);
    return isCompatible;
  } catch (err) {
    console.error('Error in isTypeCompatible:', err);
    return false;
  }
}

/**
 * Get suggested conversion for incompatible types
 * 
 * @param notionType The Notion field type
 * @param websiteType The website field type
 * @returns Suggestion string or null if no suggestion available
 */
export function getSuggestionForIncompatibleTypes(
  notionType: NotionFieldType | string,
  websiteType: WebsiteFieldType | string
): string | null {
  if (!notionType || !websiteType) return null;
  
  const key = `${notionType.toLowerCase()}_to_${websiteType.toLowerCase()}`;
  return typeConversionSuggestions[key] || null;
}

/**
 * Validates type compatibility between a Notion field type and a website field type
 * Returns a validation object with isValid, error, and suggestion properties
 */
export function validateTypeCompatibility(
  notionType: NotionFieldType | string, 
  websiteType: WebsiteFieldType | string
): { isValid: boolean; error?: string; suggestion?: string } {
  try {
    // Validate inputs
    if (!notionType || !websiteType || notionType === 'undefined' || websiteType === 'undefined') {
      return {
        isValid: false,
        error: 'Missing type parameters',
        suggestion: 'Please select valid fields on both sides'
      };
    }
    
    // Special case for 'unknown'
    if (notionType === 'unknown' || websiteType === 'unknown') {
      return {
        isValid: false,
        error: 'Field type information not available',
        suggestion: 'Please select fields with known types'
      };
    }
    
    // Check for special cases
    if (notionType === 'formula') {
      return {
        isValid: true,
        error: 'Formula type compatibility depends on the formula result type',
        suggestion: 'Review the formula result type to ensure proper data handling'
      };
    }
    
    if (notionType === 'rollup') {
      return {
        isValid: true,
        error: 'Rollup type compatibility depends on the rollup configuration',
        suggestion: 'Review the rollup configuration to ensure proper data handling'
      };
    }
    
    // Handle normal cases
    const isValid = isTypeCompatible(notionType, websiteType);
    
    if (isValid) {
      return { isValid: true };
    }
    
    // For incompatible types, provide detailed feedback
    const baseError = `Incompatible types: Notion '${notionType}' cannot be directly mapped to website '${websiteType}'`;
    const suggestion = getSuggestionForIncompatibleTypes(notionType, websiteType);
    
    return {
      isValid: false,
      error: baseError,
      suggestion: suggestion || 'No automatic conversion available, manual transformation required'
    };
  } catch (err) {
    console.error('Error in validateTypeCompatibility:', err);
    return {
      isValid: false,
      error: 'Validation error occurred',
      suggestion: 'Check browser console for details'
    };
  }
}

export const getCompatibilityLevel = (type: string): CompatibilityLevel => {
  // Actualizar esta función para manejar tipos reales en lugar de 'type1', 'type2'
  if (['title', 'richText', 'text', 'string'].includes(type)) {
    return CompatibilityLevel.HIGH;
  } else if (['number', 'date', 'boolean', 'url', 'email'].includes(type)) {
    return CompatibilityLevel.MEDIUM;
  } else {
    return CompatibilityLevel.LOW;
  }
};
