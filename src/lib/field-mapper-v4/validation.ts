/**
 * Field Mapper V4 - Validación
 * 
 * Lógica para validar la compatibilidad entre diferentes tipos de campos
 * y determinar si se requieren transformaciones.
 */

import { 
  FieldType, 
  NotionField, 
  CaseStudyField, 
  CompatibilityStatus, 
  CompatibilityInfo 
} from './types';

// Mapa de compatibilidad directa entre tipos de campos
const DIRECT_COMPATIBILITY_MAP: Partial<Record<FieldType, FieldType[]>> = {
  [FieldType.TEXT]: [FieldType.TEXT, FieldType.URL, FieldType.EMAIL, FieldType.SELECT],
  [FieldType.RICH_TEXT]: [FieldType.RICH_TEXT],
  [FieldType.NUMBER]: [FieldType.NUMBER],
  [FieldType.DATE]: [FieldType.DATE],
  [FieldType.IMAGE]: [FieldType.IMAGE, FieldType.FILES],
  [FieldType.FILES]: [FieldType.FILES],
  [FieldType.SELECT]: [FieldType.SELECT, FieldType.TEXT],
  [FieldType.MULTI_SELECT]: [FieldType.MULTI_SELECT],
  [FieldType.URL]: [FieldType.URL, FieldType.TEXT],
  [FieldType.EMAIL]: [FieldType.EMAIL, FieldType.TEXT],
  [FieldType.CHECKBOX]: [FieldType.CHECKBOX],
  [FieldType.TITLE]: [FieldType.TITLE, FieldType.TEXT, FieldType.RICH_TEXT],
  [FieldType.PHONE_NUMBER]: [FieldType.PHONE_NUMBER, FieldType.TEXT],
  [FieldType.PERSON]: [FieldType.PERSON],
  [FieldType.FORMULA]: [FieldType.FORMULA],
  [FieldType.RELATION]: [FieldType.RELATION],
  [FieldType.ROLLUP]: [FieldType.ROLLUP],
  [FieldType.CREATED_TIME]: [FieldType.CREATED_TIME, FieldType.DATE],
  [FieldType.CREATED_BY]: [FieldType.CREATED_BY, FieldType.PERSON],
  [FieldType.LAST_EDITED_TIME]: [FieldType.LAST_EDITED_TIME, FieldType.DATE],
  [FieldType.LAST_EDITED_BY]: [FieldType.LAST_EDITED_BY, FieldType.PERSON],
  [FieldType.STATUS]: [FieldType.STATUS, FieldType.SELECT],
};

// Mapa de transformaciones posibles entre tipos de campos
const TRANSFORMATION_COMPATIBILITY_MAP: Partial<Record<FieldType, FieldType[]>> = {
  [FieldType.TEXT]: [FieldType.RICH_TEXT],
  [FieldType.RICH_TEXT]: [FieldType.TEXT],
  [FieldType.NUMBER]: [FieldType.TEXT],
  [FieldType.DATE]: [FieldType.TEXT],
  [FieldType.SELECT]: [FieldType.MULTI_SELECT],
  [FieldType.MULTI_SELECT]: [FieldType.SELECT, FieldType.TEXT],
  [FieldType.CHECKBOX]: [FieldType.TEXT],
  [FieldType.URL]: [FieldType.RICH_TEXT],
  [FieldType.EMAIL]: [FieldType.RICH_TEXT],
  [FieldType.IMAGE]: [],
  [FieldType.FILES]: [FieldType.IMAGE],
  [FieldType.TITLE]: [FieldType.TEXT, FieldType.RICH_TEXT],
  [FieldType.PHONE_NUMBER]: [FieldType.TEXT],
  [FieldType.FORMULA]: [FieldType.TEXT, FieldType.NUMBER],
  [FieldType.CREATED_TIME]: [FieldType.TEXT],
  [FieldType.LAST_EDITED_TIME]: [FieldType.TEXT],
  [FieldType.STATUS]: [FieldType.SELECT, FieldType.TEXT],
};

/**
 * Verifica la compatibilidad entre un campo de Notion y un campo de Case Study
 */
export function checkFieldCompatibility(
  notionField: NotionField, 
  caseStudyField: CaseStudyField
): CompatibilityInfo {
  const sourceType = notionField.type;
  const targetType = caseStudyField.type;

  // Verificar compatibilidad directa
  if (DIRECT_COMPATIBILITY_MAP[targetType]?.includes(sourceType)) {
    return {
      status: CompatibilityStatus.COMPATIBLE,
      message: 'Los campos son directamente compatibles',
    };
  }

  // Verificar si se requiere transformación
  if (TRANSFORMATION_COMPATIBILITY_MAP[sourceType]?.includes(targetType)) {
    return {
      status: CompatibilityStatus.REQUIRES_TRANSFORMATION,
      transformationId: `${sourceType}_to_${targetType}`,
      message: `Se requiere transformación de ${sourceType} a ${targetType}`,
    };
  }

  // Si no se encontró compatibilidad
  return {
    status: CompatibilityStatus.INCOMPATIBLE,
    message: `Los tipos ${sourceType} y ${targetType} no son compatibles`,
  };
}

/**
 * Verifica la compatibilidad de todos los campos mapeados
 */
export function validateAllMappings(
  notionFields: NotionField[],
  caseStudyFields: CaseStudyField[],
  mappings: { notionFieldId: string; caseStudyFieldId: string }[]
): Record<string, CompatibilityInfo> {
  const result: Record<string, CompatibilityInfo> = {};

  for (const mapping of mappings) {
    const notionField = notionFields.find(f => f.id === mapping.notionFieldId);
    const caseStudyField = caseStudyFields.find(f => f.id === mapping.caseStudyFieldId);

    if (notionField && caseStudyField) {
      result[`${mapping.notionFieldId}_${mapping.caseStudyFieldId}`] = 
        checkFieldCompatibility(notionField, caseStudyField);
    }
  }

  return result;
}

/**
 * Determina campos recomendados para mapear a un campo de Case Study
 */
export function getRecommendedFields(
  notionFields: NotionField[],
  caseStudyField: CaseStudyField
): {
  directlyCompatible: NotionField[];
  requiresTransformation: NotionField[];
  incompatible: NotionField[];
} {
  const directlyCompatible: NotionField[] = [];
  const requiresTransformation: NotionField[] = [];
  const incompatible: NotionField[] = [];

  for (const field of notionFields) {
    const compatibility = checkFieldCompatibility(field, caseStudyField);
    
    switch (compatibility.status) {
      case CompatibilityStatus.COMPATIBLE:
        directlyCompatible.push(field);
        break;
      case CompatibilityStatus.REQUIRES_TRANSFORMATION:
        requiresTransformation.push(field);
        break;
      case CompatibilityStatus.INCOMPATIBLE:
        incompatible.push(field);
        break;
    }
  }

  return {
    directlyCompatible,
    requiresTransformation,
    incompatible,
  };
}
