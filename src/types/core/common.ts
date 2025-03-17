/**
 * Tipos comunes compartidos en toda la aplicación
 * 
 * Este archivo contiene definiciones de tipos fundamentales que se utilizan
 * en múltiples partes de la aplicación. Centralizar estos tipos ayuda a
 * mantener la consistencia y facilita los cambios globales.
 */

/**
 * Tipo para IDs
 * Todos los IDs en la aplicación deben usar este tipo para mantener consistencia
 */
export type ID = string;

/**
 * Tipo para fechas en formato ISO
 * Todas las fechas en la aplicación deben usar este tipo
 */
export type ISODateString = string;

/**
 * Estados comunes para entidades
 */
export type EntityStatus = 'draft' | 'published' | 'archived';

/**
 * Tipo para respuestas de API genéricas
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Tipo para metadatos comunes de entidades
 */
export interface EntityMetadata {
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

/**
 * Tipo para elementos multimedia (imágenes/videos)
 */
export interface MediaItem {
  id: ID;
  type: 'image' | 'video';
  url: string;
  // Solo se requiere videoType cuando el tipo es 'video'
  videoType?: 'vimeo' | 'youtube' | 'local' | null;
  thumbnailUrl?: string | null;
  alt: string;
  width: number;
  height: number;
  order: number;
  displayMode?: 'single' | 'dual' | 'dual_left' | 'dual_right' | null;
}

/**
 * Tipo para opciones de paginación
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Tipo para resultados paginados
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Tipo para filtros básicos
 */
export interface BaseFilters {
  search?: string;
  status?: EntityStatus;
  startDate?: ISODateString;
  endDate?: ISODateString;
}

/**
 * Tipo para errores de validación
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Tipo para respuestas con errores de validación
 */
export interface ValidationErrorResponse {
  success: false;
  message: string;
  errors: ValidationError[];
}

/**
 * Type guard para comprobar si un valor es un error de validación
 */
export function isValidationErrorResponse(value: unknown): value is ValidationErrorResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    value.success === false &&
    'errors' in value &&
    Array.isArray((value as ValidationErrorResponse).errors)
  );
}

/**
 * Tipo para opciones de transformación
 */
export interface TransformOptions {
  [key: string]: unknown;
}

/**
 * Niveles de compatibilidad para transformaciones
 */
export enum CompatibilityLevel {
  DIRECT = 'direct',
  TRANSFORM = 'transform',
  INCOMPATIBLE = 'incompatible'
}

/**
 * Tipo para estadísticas de caché
 */
export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  maxSize: number;
  avgAccessTime: number;
}
