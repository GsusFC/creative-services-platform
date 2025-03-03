/**
 * Servicio de validación para Field Mapper V3
 * 
 * Este archivo proporciona funciones para validar la compatibilidad entre
 * campos de componentes de Notion y componentes de la página web,
 * específicamente optimizado para landing pages de Case Studies.
 */

import { measurePerformanceSync } from './performance-service'
import { ComponentField, ComponentMapping, PageComponent, NotionComponent } from './v3-types'
import { typeValidationCache } from './cache-service'
import { 
  hasTransformation 
} from './v3-transformations'

// Definir niveles de compatibilidad
export enum ComponentCompatibilityLevel {
  ERROR = 0,              // No compatible, no se puede transformar
  WARNING = 1,            // Compatible con transformación o adaptación
  COMPATIBLE = 2,         // Totalmente compatible
  INFO = 3                // Información adicional (no es un error ni advertencia)
}

// Interfaz para resultado de validación
export interface ValidationResult {
  level: ComponentCompatibilityLevel;
  message: string;
}

// Mapa de compatibilidad entre tipos de campos
const TYPE_COMPATIBILITY_MAP: Record<string, Record<string, ValidationResult>> = {
  // Tipos de campos de landing page
  "text": {
    "text": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
    "title": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
    "rich_text": { level: ComponentCompatibilityLevel.WARNING, message: "Compatible, pero se perderá el formato" },
    "url": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
    "email": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
    "select": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
    "multi_select": { level: ComponentCompatibilityLevel.WARNING, message: "Compatible, se usará el primer valor" },
    "number": { level: ComponentCompatibilityLevel.WARNING, message: "Compatible, se convertirá a texto" },
    "date": { level: ComponentCompatibilityLevel.WARNING, message: "Compatible, se convertirá a formato de texto" },
  },
  "rich_text": {
    "rich_text": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
    "text": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
    "title": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
    "list": { level: ComponentCompatibilityLevel.WARNING, message: "Compatible, se convertirá a formato de lista" },
  },
  "image": {
    "files": { level: ComponentCompatibilityLevel.WARNING, message: "Compatible, se usará la primera imagen" },
    "url": { level: ComponentCompatibilityLevel.WARNING, message: "Compatible, se cargará la imagen desde la URL" },
    "cover": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
  },
  "files": {
    "files": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
    "gallery": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
    "images": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
  },
  "url": {
    "url": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
    "text": { level: ComponentCompatibilityLevel.WARNING, message: "Compatible, asegúrate que el texto sea una URL válida" },
    "link": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
  },
  "date": {
    "date": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
    "created_time": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
    "last_edited_time": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
    "text": { level: ComponentCompatibilityLevel.WARNING, message: "Compatible, asegúrate que tenga formato de fecha" },
  },
  "list": {
    "multi_select": { level: ComponentCompatibilityLevel.WARNING, message: "Compatible, se transformará a formato de lista" },
    "rich_text": { level: ComponentCompatibilityLevel.WARNING, message: "Compatible, requiere parseo de HTML" },
    "list": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
    "relation": { level: ComponentCompatibilityLevel.WARNING, message: "Compatible, se transformará a lista de relaciones" },
  },
  "multi_select": {
    "multi_select": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
    "select": { level: ComponentCompatibilityLevel.WARNING, message: "Compatible, solo se usará un valor" },
    "tags": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
    "rich_text": { level: ComponentCompatibilityLevel.WARNING, message: "Compatible, se transformará a lista de valores" },
    "relation": { level: ComponentCompatibilityLevel.WARNING, message: "Compatible, se transformará a lista de etiquetas" },
  },
  "relation": {
    "relation": { level: ComponentCompatibilityLevel.COMPATIBLE, message: "Compatibles" },
    "multi_select": { level: ComponentCompatibilityLevel.WARNING, message: "Compatible, pero se perderá información adicional" },
    "list": { level: ComponentCompatibilityLevel.WARNING, message: "Compatible, se cargarán los valores relacionados" },
  }
}

/**
 * Valida la compatibilidad entre un campo de página y un campo de Notion
 * 
 * @param pageField Campo de la página
 * @param notionField Campo de Notion
 * @returns Resultado de la validación
 */
export function validateCompatibility(
  pageField: ComponentField, 
  notionField: ComponentField
): ValidationResult {
  // Verificación de función de rendimiento
  return measurePerformanceSync('validateCompatibility', () => {
    // Verificar en caché
    const cacheKey = `${pageField.id}:${pageField.type}:${notionField.id}:${notionField.type}`;
    const cachedResult = typeValidationCache.get(cacheKey);
    
    if (cachedResult !== undefined) {
      return cachedResult;
    }
    
    // Si los tipos son iguales, son compatibles
    if (pageField.type === notionField.type) {
      const result = { 
        level: ComponentCompatibilityLevel.COMPATIBLE, 
        message: "Los tipos son idénticos y completamente compatibles" 
      };
      typeValidationCache.set(cacheKey, result);
      return result;
    }
    
    // Verificar si existe una transformación disponible
    if (hasTransformation(notionField.type, pageField.type)) {
      const result = {
        level: ComponentCompatibilityLevel.WARNING,
        message: `Los tipos son diferentes, pero se aplicará una transformación automática`
      };
      typeValidationCache.set(cacheKey, result);
      return result;
    }
    
    // Comprobar compatibilidad en tabla de compatibilidad
    const compatibilityLevel = getCompatibilityLevelFromMap(pageField.type, notionField.type);
    
    // Generar resultado según nivel de compatibilidad
    let result: ValidationResult;
    
    switch (compatibilityLevel) {
      case ComponentCompatibilityLevel.COMPATIBLE:
        result = { 
          level: ComponentCompatibilityLevel.COMPATIBLE, 
          message: "Los tipos son compatibles" 
        };
        break;
        
      case ComponentCompatibilityLevel.WARNING:
        result = { 
          level: ComponentCompatibilityLevel.WARNING, 
          message: "Los tipos son compatibles, pero pueden requerir conversión manual" 
        };
        break;
        
      case ComponentCompatibilityLevel.INFO:
        result = { 
          level: ComponentCompatibilityLevel.INFO, 
          message: "Los tipos son compatibles, pero verifica el formato" 
        };
        break;
        
      case ComponentCompatibilityLevel.ERROR:
      default:
        result = { 
          level: ComponentCompatibilityLevel.ERROR, 
          message: `Los tipos no son compatibles: '${pageField.type}' no acepta '${notionField.type}'` 
        };
        break;
    }
    
    // Guardar en caché
    typeValidationCache.set(cacheKey, result);
    
    return result;
  });
}

/**
 * Valida la compatibilidad entre dos tipos de campos y devuelve un resultado detallado
 * 
 * Esta función comprueba si dos tipos de campos son compatibles y de qué manera.
 * Utiliza tanto el mapa de compatibilidad estático como el sistema de transformaciones
 * para determinar el nivel de compatibilidad.
 * 
 * @param sourceType Tipo del campo fuente (de Notion)
 * @param targetType Tipo del campo destino (de la página)
 * @returns Resultado de validación con nivel y mensaje descriptivo
 */
export function validateFieldCompatibility(
  sourceType: string, 
  targetType: string
): ValidationResult {
  // Para evitar problemas de serialización, asegurémonos de que los tipos son strings
  const sourceTypeStr = String(sourceType);
  const targetTypeStr = String(targetType);
  
  // Generar una clave única para almacenar en caché
  const cacheKey = `${targetTypeStr}:${sourceTypeStr}`;
  
  // Intentar obtener el resultado de la caché
  const cachedResult = typeValidationCache.get(cacheKey);
  if (cachedResult !== undefined) {
    return cachedResult as ValidationResult;
  }
  
  // Si no tenemos un resultado en caché, calcularlo
  return measurePerformanceSync<ValidationResult>('fieldTypeValidation', () => {
    // Normalizar los tipos a minúsculas
    const normalizedTargetType = targetTypeStr.toLowerCase();
    const normalizedSourceType = sourceTypeStr.toLowerCase();
    
    // Si los tipos son idénticos, son completamente compatibles
    if (normalizedSourceType === normalizedTargetType) {
      const result: ValidationResult = {
        level: ComponentCompatibilityLevel.COMPATIBLE,
        message: "Tipos idénticos, completamente compatibles"
      };
      typeValidationCache.set(cacheKey, result);
      return result;
    }
    
    // Buscar en el mapa de compatibilidad
    const compatibilityMap = TYPE_COMPATIBILITY_MAP[normalizedTargetType];
    if (!compatibilityMap) {
      // Si el tipo de página no está en el mapa, comprobamos si hay transformación disponible
      if (hasTransformation(normalizedSourceType, normalizedTargetType)) {
        const result: ValidationResult = {
          level: ComponentCompatibilityLevel.WARNING,
          message: `Tipo compatible mediante transformación automática`
        };
        typeValidationCache.set(cacheKey, result);
        return result;
      }
      
      // Si no hay transformación disponible, es incompatible
      const result: ValidationResult = { 
        level: ComponentCompatibilityLevel.ERROR, 
        message: `Tipo "${targetType}" no soportado` 
      };
      typeValidationCache.set(cacheKey, result);
      return result;
    }
    
    // Verificar la compatibilidad según el mapa
    const compatibilityResult = compatibilityMap[normalizedSourceType];
    if (!compatibilityResult) {
      // Si no está en el mapa, verificamos si hay transformación disponible
      if (hasTransformation(normalizedSourceType, normalizedTargetType)) {
        const result: ValidationResult = {
          level: ComponentCompatibilityLevel.WARNING,
          message: `Compatible mediante transformación automática`
        };
        typeValidationCache.set(cacheKey, result);
        return result;
      }
      
      // Si no hay transformación, es incompatible
      const result: ValidationResult = { 
        level: ComponentCompatibilityLevel.ERROR, 
        message: `Tipos incompatibles: "${targetType}" y "${sourceType}"` 
      };
      typeValidationCache.set(cacheKey, result);
      return result;
    }
    
    // Almacenar el resultado en caché
    typeValidationCache.set(cacheKey, compatibilityResult);
    
    return compatibilityResult;
  });
}

/**
 * Valida un mapping completo entre componentes
 * 
 * @param mapping Mapping a validar
 * @param pageComponents Lista de componentes de página disponibles
 * @param notionComponents Lista de componentes de Notion disponibles
 * @returns Resultado de la validación con detalles por campo
 */
export function validateMapping(
  mapping: ComponentMapping,
  pageComponents: PageComponent[],
  notionComponents: NotionComponent[]
): {
  valid: boolean;
  validationResults: Array<{
    fieldId: string;
    level: ComponentCompatibilityLevel;
    message: string;
  }>;
} {
  return measurePerformanceSync('validateMapping', () => {
    // Encontrar los componentes
    const pageComponent = pageComponents.find(pc => pc.id === mapping.pageComponentId);
    const notionComponent = notionComponents.find(nc => nc.id === mapping.notionComponentId);
    
    if (!pageComponent || !notionComponent) {
      return {
        valid: false,
        validationResults: [{
          fieldId: 'component',
          level: ComponentCompatibilityLevel.ERROR,
          message: 'No se encontraron los componentes para este mapping'
        }]
      };
    }
    
    // Validar cada campo mapeado
    const validationResults: Array<{
      fieldId: string;
      level: ComponentCompatibilityLevel;
      message: string;
    }> = [];
    
    // Verificar campos requeridos
    for (const pageField of pageComponent.fields) {
      // Si el campo es requerido, verificar que tenga un mapping
      if (pageField.required) {
        const fieldMapping = mapping.fieldMappings.find(fm => fm.pageFieldId === pageField.id);
        
        if (!fieldMapping || !fieldMapping.notionFieldId) {
          validationResults.push({
            fieldId: pageField.id,
            level: ComponentCompatibilityLevel.ERROR,
            message: `Campo requerido '${pageField.name}' no está mapeado`
          });
          continue;
        }
      }
    }
    
    // Validar compatibilidad de cada mapping
    for (const fieldMapping of mapping.fieldMappings) {
      // Si no hay notionFieldId, continuar
      if (!fieldMapping.notionFieldId) continue;
      
      const pageField = pageComponent.fields.find(pf => pf.id === fieldMapping.pageFieldId);
      const notionField = notionComponent.fields.find(nf => nf.id === fieldMapping.notionFieldId);
      
      if (!pageField || !notionField) {
        validationResults.push({
          fieldId: fieldMapping.pageFieldId,
          level: ComponentCompatibilityLevel.ERROR,
          message: 'No se encontró uno de los campos para este mapping'
        });
        continue;
      }
      
      // Verificar si el campo tiene una transformación aplicable
      const canTransform = hasTransformation(
        notionField.type, 
        pageField.type
      );
      
      // Si los tipos son iguales o hay transformación, no hay problema
      if (pageField.type === notionField.type || canTransform) {
        // Si hay transformación, agregar advertencia informativa
        if (canTransform && pageField.type !== notionField.type) {
          validationResults.push({
            fieldId: pageField.id,
            level: ComponentCompatibilityLevel.INFO,
            message: `Se aplicará transformación`
          });
        }
        continue;
      }
      
      // Verificar compatibilidad
      const compatibilityLevel = getCompatibilityLevelFromMap(pageField.type, notionField.type);
      
      // Generar resultado según nivel de compatibilidad
      if (compatibilityLevel !== ComponentCompatibilityLevel.COMPATIBLE) {
        validationResults.push({
          fieldId: pageField.id,
          level: compatibilityLevel,
          message: getCompatibilityMessage(pageField.type, notionField.type, compatibilityLevel)
        });
      }
    }
    
    // Determinar si el mapping es válido (no tiene errores)
    const valid = !validationResults.some(
      result => result.level === ComponentCompatibilityLevel.ERROR
    );
    
    return {
      valid,
      validationResults
    };
  });
}

function getCompatibilityLevelFromMap(pageFieldType: string, notionFieldType: string): ComponentCompatibilityLevel {
  const compatibilityMap = TYPE_COMPATIBILITY_MAP[pageFieldType.toLowerCase()];
  if (!compatibilityMap) {
    return ComponentCompatibilityLevel.ERROR;
  }
  const compatibilityResult = compatibilityMap[notionFieldType.toLowerCase()];
  if (!compatibilityResult) {
    return ComponentCompatibilityLevel.ERROR;
  }
  return compatibilityResult.level;
}

function getCompatibilityMessage(pageFieldType: string, notionFieldType: string, _compatibilityLevel: ComponentCompatibilityLevel): string {
  const compatibilityMap = TYPE_COMPATIBILITY_MAP[pageFieldType.toLowerCase()];
  if (!compatibilityMap) {
    return `Tipo "${pageFieldType}" no soportado`;
  }
  const compatibilityResult = compatibilityMap[notionFieldType.toLowerCase()];
  if (!compatibilityResult) {
    return `Tipos incompatibles: "${pageFieldType}" y "${notionFieldType}"`;
  }
  return compatibilityResult.message;
}
