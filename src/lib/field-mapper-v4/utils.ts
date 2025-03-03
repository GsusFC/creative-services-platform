/**
 * Utilidades para Field Mapper V4
 * 
 * Funciones auxiliares para trabajar con campos, transformaciones y visualización
 */

import { FieldType, NotionField, CaseStudyField, FieldMapping, CompatibilityStatus } from './types';
import { checkFieldCompatibility } from './compatibility';

/**
 * Obtiene un campo de Notion por su ID
 * 
 * @param notionFields - Lista de campos de Notion
 * @param fieldId - ID del campo a buscar
 * @returns El campo de Notion o undefined
 */
export function getNotionFieldById(notionFields: NotionField[], fieldId: string): NotionField | undefined {
  return notionFields.find(field => field.id === fieldId);
}

/**
 * Obtiene un campo de Case Study por su ID
 * 
 * @param caseStudyFields - Lista de campos de Case Study
 * @param fieldId - ID del campo a buscar
 * @returns El campo de Case Study o undefined
 */
export function getCaseStudyFieldById(caseStudyFields: CaseStudyField[], fieldId: string): CaseStudyField | undefined {
  return caseStudyFields.find(field => field.id === fieldId);
}

/**
 * Obtiene el mapeo para un campo de Case Study
 * 
 * @param mappings - Lista de mapeos
 * @param caseStudyFieldId - ID del campo de Case Study
 * @returns El mapeo o undefined
 */
export function getMappingForCaseStudyField(mappings: FieldMapping[], caseStudyFieldId: string): FieldMapping | undefined {
  return mappings.find(mapping => mapping.caseStudyFieldId === caseStudyFieldId);
}

/**
 * Verifica si un mapeo necesita transformación
 * 
 * @param mapping - Mapeo a verificar
 * @param caseStudyFields - Lista de campos de Case Study
 * @param notionFields - Lista de campos de Notion
 * @returns true si necesita transformación
 */
export function mappingRequiresTransformation(
  mapping: FieldMapping, 
  caseStudyFields: CaseStudyField[], 
  notionFields: NotionField[]
): boolean {
  const caseStudyField = getCaseStudyFieldById(caseStudyFields, mapping.caseStudyFieldId);
  const notionField = getNotionFieldById(notionFields, mapping.notionFieldId);
  
  if (!caseStudyField || !notionField) return false;
  
  const compatibilityStatus = checkFieldCompatibility(
    caseStudyField.type as FieldType, 
    notionField.type as FieldType
  );
  
  return compatibilityStatus === CompatibilityStatus.REQUIRES_TRANSFORMATION;
}

/**
 * Convierte un tipo de campo de Notion al tipo equivalente en nuestra aplicación
 * 
 * @param notionType - Tipo de campo en la API de Notion
 * @returns Tipo de campo en nuestra aplicación
 */
export function mapNotionTypeToFieldType(notionType: string): FieldType {
  // Mapeo de tipos de Notion a nuestros tipos
  const typeMap: Record<string, FieldType> = {
    'title': FieldType.TITLE,
    'rich_text': FieldType.RICH_TEXT,
    'text': FieldType.TEXT,
    'number': FieldType.NUMBER,
    'select': FieldType.SELECT,
    'multi_select': FieldType.MULTI_SELECT,
    'date': FieldType.DATE,
    'people': FieldType.PERSON,
    'files': FieldType.FILES,
    'checkbox': FieldType.CHECKBOX,
    'url': FieldType.URL,
    'email': FieldType.EMAIL,
    'phone_number': FieldType.PHONE_NUMBER,
    'formula': FieldType.FORMULA,
    'relation': FieldType.RELATION,
    'rollup': FieldType.ROLLUP,
    'created_time': FieldType.CREATED_TIME,
    'created_by': FieldType.CREATED_BY,
    'last_edited_time': FieldType.LAST_EDITED_TIME,
    'last_edited_by': FieldType.LAST_EDITED_BY,
    'status': FieldType.STATUS,
  };
  
  return typeMap[notionType] || FieldType.TEXT;
}

/**
 * Formatea un tipo de campo para mostrar en la interfaz
 * 
 * @param type - Tipo de campo
 * @returns Etiqueta formateada para mostrar
 */
export function formatFieldType(type: FieldType): string {
  const formatMap: Record<FieldType, string> = {
    [FieldType.TEXT]: 'Texto',
    [FieldType.RICH_TEXT]: 'Texto enriquecido',
    [FieldType.TITLE]: 'Título',
    [FieldType.NUMBER]: 'Número',
    [FieldType.DATE]: 'Fecha',
    [FieldType.CHECKBOX]: 'Checkbox',
    [FieldType.SELECT]: 'Select',
    [FieldType.MULTI_SELECT]: 'Multi-select',
    [FieldType.URL]: 'URL',
    [FieldType.EMAIL]: 'Email',
    [FieldType.PHONE_NUMBER]: 'Teléfono',
    [FieldType.PERSON]: 'Persona',
    [FieldType.FILES]: 'Archivos',
    [FieldType.IMAGE]: 'Imagen',
    [FieldType.FORMULA]: 'Fórmula',
    [FieldType.RELATION]: 'Relación',
    [FieldType.ROLLUP]: 'Rollup',
    [FieldType.CREATED_TIME]: 'Fecha de creación',
    [FieldType.CREATED_BY]: 'Creado por',
    [FieldType.LAST_EDITED_TIME]: 'Última edición',
    [FieldType.LAST_EDITED_BY]: 'Editado por',
    [FieldType.STATUS]: 'Estado',
  };
  
  return formatMap[type] || String(type);
}
