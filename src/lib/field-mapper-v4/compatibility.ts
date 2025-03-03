/**
 * Sistema de validación de compatibilidad
 * 
 * Define reglas para determinar la compatibilidad entre diferentes tipos
 * de campos y proporciona funciones para validarlos.
 */

import { FieldType, CompatibilityStatus } from './types';
import { transformations } from './transformations';

// Mapa de compatibilidad directa entre tipos de campo
const directCompatibilityMap: Record<FieldType, FieldType[]> = {
  [FieldType.TEXT]: [FieldType.TEXT, FieldType.TITLE, FieldType.RICH_TEXT],
  [FieldType.RICH_TEXT]: [FieldType.RICH_TEXT, FieldType.TEXT, FieldType.TITLE],
  [FieldType.TITLE]: [FieldType.TITLE, FieldType.TEXT, FieldType.RICH_TEXT],
  [FieldType.NUMBER]: [FieldType.NUMBER],
  [FieldType.CHECKBOX]: [FieldType.CHECKBOX],
  [FieldType.SELECT]: [FieldType.SELECT],
  [FieldType.MULTI_SELECT]: [FieldType.MULTI_SELECT],
  [FieldType.DATE]: [FieldType.DATE],
  [FieldType.PERSON]: [FieldType.PERSON],
  [FieldType.FILES]: [FieldType.FILES],
  [FieldType.URL]: [FieldType.URL],
  [FieldType.EMAIL]: [FieldType.EMAIL],
  [FieldType.PHONE_NUMBER]: [FieldType.PHONE_NUMBER],
  [FieldType.FORMULA]: [],
  [FieldType.RELATION]: [],
  [FieldType.ROLLUP]: [],
  [FieldType.CREATED_TIME]: [FieldType.CREATED_TIME, FieldType.DATE],
  [FieldType.CREATED_BY]: [FieldType.CREATED_BY, FieldType.PERSON],
  [FieldType.LAST_EDITED_TIME]: [FieldType.LAST_EDITED_TIME, FieldType.DATE],
  [FieldType.LAST_EDITED_BY]: [FieldType.LAST_EDITED_BY, FieldType.PERSON],
  [FieldType.STATUS]: [FieldType.STATUS, FieldType.SELECT],
  [FieldType.IMAGE]: [FieldType.IMAGE],
};

/**
 * Comprueba la compatibilidad entre dos tipos de campo
 * 
 * @param targetType - Tipo de campo destino (case study)
 * @param sourceType - Tipo de campo origen (notion)
 * @returns Estado de compatibilidad
 */
export function checkFieldCompatibility(
  targetType: FieldType,
  sourceType: FieldType
): CompatibilityStatus {
  // Verificar compatibilidad directa
  if (directCompatibilityMap[targetType].includes(sourceType)) {
    return CompatibilityStatus.COMPATIBLE;
  }
  
  // Verificar si existe una transformación
  const availableTransformation = transformations.some(
    t => t.sourceType === sourceType && t.targetType === targetType
  );
  
  if (availableTransformation) {
    return CompatibilityStatus.REQUIRES_TRANSFORMATION;
  }
  
  // Si no hay compatibilidad directa ni transformación disponible
  return CompatibilityStatus.INCOMPATIBLE;
}

/**
 * Obtiene todas las transformaciones disponibles entre dos tipos de campo
 * 
 * @param sourceType - Tipo de campo origen
 * @param targetType - Tipo de campo destino
 * @returns Lista de transformaciones
 */
export function getAvailableTransformations(sourceType: FieldType, targetType: FieldType) {
  return transformations.filter(
    t => t.sourceType === sourceType && t.targetType === targetType
  );
}

/**
 * Determina si un tipo de campo puede ser transformado a otro
 * 
 * @param sourceType - Tipo de campo origen
 * @param targetType - Tipo de campo destino
 * @returns true si existe alguna transformación disponible
 */
export function canBeTransformed(sourceType: FieldType, targetType: FieldType): boolean {
  return getAvailableTransformations(sourceType, targetType).length > 0;
}

/**
 * Obtiene todos los tipos de campos que son compatibles con un tipo dado
 * (directamente o mediante transformaciones)
 * 
 * @param targetType - Tipo de campo para el que buscar compatibilidades
 * @returns Mapa con tipos de campo y su nivel de compatibilidad
 */
export function getCompatibleTypes(targetType: FieldType): Record<FieldType, CompatibilityStatus> {
  const result: Record<FieldType, CompatibilityStatus> = {} as Record<FieldType, CompatibilityStatus>;
  
  // Verificar cada tipo de campo
  Object.values(FieldType).forEach(sourceType => {
    result[sourceType] = checkFieldCompatibility(targetType, sourceType);
  });
  
  return result;
}
