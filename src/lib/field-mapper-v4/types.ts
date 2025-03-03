/**
 * Field Mapper V4 - Tipos base
 * 
 * Definición de tipos para el Field Mapper V4, enfocado en mapear campos
 * entre Notion y la estructura de Case Studies de forma simplificada.
 */

// Enumeración de tipos de campo disponibles
export enum FieldType {
  TEXT = 'text',
  RICH_TEXT = 'rich_text',
  TITLE = 'title',
  NUMBER = 'number',
  DATE = 'date',
  CHECKBOX = 'checkbox',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  URL = 'url',
  EMAIL = 'email',
  PHONE_NUMBER = 'phone_number',
  PERSON = 'person',
  FILES = 'files',
  IMAGE = 'image',
  FORMULA = 'formula',
  RELATION = 'relation',
  ROLLUP = 'rollup',
  CREATED_TIME = 'created_time',
  CREATED_BY = 'created_by',
  LAST_EDITED_TIME = 'last_edited_time',
  LAST_EDITED_BY = 'last_edited_by',
  STATUS = 'status',
}

// Definición de un campo base (común para campos de Notion y Case Study)
export interface BaseField {
  id: string;
  name: string;
  type: FieldType;
  required?: boolean;
  description?: string;
}

// Campo específico de Notion
export interface NotionField extends BaseField {
  source: 'notion';
  notionId: string;
  propertyType: string;
}

// Campo específico de Case Study
export interface CaseStudyField extends BaseField {
  source: 'case_study';
  section: CaseStudySection;
  defaultValue?: string | number | boolean | string[] | null;
  maxLength?: number;
}

// Secciones disponibles en el Case Study
export enum CaseStudySection {
  HERO = 'hero',
  MAIN_INFO = 'main_info',
  GALLERY = 'gallery',
}

// Definición de un mapeo entre campos
export interface FieldMapping {
  caseStudyFieldId: string;
  notionFieldId: string;
  transformationId?: string;
  transformationOptions?: Record<string, string | number | boolean | string[]>;
}

// Estado de compatibilidad entre campos
export enum CompatibilityStatus {
  COMPATIBLE = 'compatible',
  REQUIRES_TRANSFORMATION = 'requires_transformation',
  INCOMPATIBLE = 'incompatible',
}

// Información de compatibilidad
export interface CompatibilityInfo {
  status: CompatibilityStatus;
  transformationId?: string;
  message?: string;
}

// Configuración simplificada para guardar
export interface MapperConfig {
  notionDatabaseId: string;
  mappings: FieldMapping[];
}

// Configuración completa de un Field Mapper
export interface FieldMapperConfig {
  id: string;
  name: string;
  notionDatabaseId: string;
  mappings: FieldMapping[];
  galleryItemCount?: number;
  hasCompletedOnboarding?: boolean; // Indica si el usuario ha completado el tutorial
  createdAt: string;
  updatedAt: string;
}

// Estructura predefinida del Case Study
export const CASE_STUDY_STRUCTURE: CaseStudyField[] = [
  {
    id: 'hero_image',
    name: 'Imagen/Vídeo Hero',
    type: FieldType.IMAGE,
    source: 'case_study',
    section: CaseStudySection.HERO,
    required: true,
  },
  {
    id: 'project_name',
    name: 'Nombre Proyecto',
    type: FieldType.TEXT,
    source: 'case_study',
    section: CaseStudySection.MAIN_INFO,
    required: true,
  },
  {
    id: 'tagline',
    name: 'Tagline',
    type: FieldType.TEXT,
    source: 'case_study',
    section: CaseStudySection.MAIN_INFO,
    required: false,
    maxLength: 120,
  },
  {
    id: 'description',
    name: 'Descripción',
    type: FieldType.RICH_TEXT,
    source: 'case_study',
    section: CaseStudySection.MAIN_INFO,
    required: true,
  },
  {
    id: 'services',
    name: 'Servicios',
    type: FieldType.MULTI_SELECT,
    source: 'case_study',
    section: CaseStudySection.MAIN_INFO,
    required: false,
  },
  {
    id: 'gallery',
    name: 'Listado Imágenes/Vídeos',
    type: FieldType.FILES,
    source: 'case_study',
    section: CaseStudySection.GALLERY,
    required: false,
  },
];
