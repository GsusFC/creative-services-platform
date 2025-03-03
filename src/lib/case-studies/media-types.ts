/**
 * Tipos para el sistema de medios flexible
 */

/**
 * Tipo de elemento multimedia (archivo local o URL externa)
 */
export type MediaItemType = 'file' | 'url';

/**
 * Tipo de layout para secciones multimedia
 */
export type MediaLayoutType = 'single' | 'double' | 'grid';

/**
 * Elemento multimedia individual
 */
export interface MediaItem {
  id: string;
  type: MediaItemType;
  source: string; // Ruta del archivo local o URL externa
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Sección multimedia con layout y elementos
 */
export interface MediaSection {
  id: string;
  layout: MediaLayoutType;
  items: MediaItem[];
  title?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Datos para crear un nuevo elemento multimedia
 */
export interface CreateMediaItemData {
  type: MediaItemType;
  source: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
}

/**
 * Datos para crear una nueva sección multimedia
 */
export interface CreateMediaSectionData {
  layout: MediaLayoutType;
  items: CreateMediaItemData[];
  title?: string;
  description?: string;
}
