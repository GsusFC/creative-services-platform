/**
 * Tipos relacionados con los estudios de caso (Case Studies)
 * 
 * Este archivo centraliza todas las definiciones de tipos relacionadas con
 * los estudios de caso para mantener la consistencia en toda la aplicación.
 */

import { ID, ISODateString, EntityStatus, MediaItem } from './common';

/**
 * Estructura principal de un Case Study
 */
export interface CaseStudy {
  id: ID;
  title: string;
  client: string;
  description: string; // Descripción corta para listados
  description2: string; // Descripción larga para página detalle
  mediaItems: MediaItem[];
  tags: string[];
  order: number;
  slug: string;
  status: EntityStatus;
  featured: boolean; // Para mostrar en home
  featuredOrder: number; // Posición en el listado de la home (1-4)
  createdAt?: ISODateString | undefined; // Fecha de creación
  updatedAt?: ISODateString | undefined; // Fecha de última actualización
  nextProject?: {
    slug: string;
    title?: string | undefined;
  } | undefined; // Referencia al siguiente proyecto para navegación
}

/**
 * Tipo para actualizar el estado de destacado
 */
export interface FeaturedCaseUpdate {
  id: ID;
  featured: boolean;
  featuredOrder: number;
}

/**
 * Tipo para los casos destacados (versión simplificada de CaseStudy)
 */
export interface FeaturedCase {
  id: ID;
  title: string;
  slug: string;
  description: string;
  client: string;
  mediaItems: MediaItem[];
  tags: string[];
  featured: boolean;
  featuredOrder: number;
  createdAt?: ISODateString | undefined;
  updatedAt?: ISODateString | undefined;
}

/**
 * Tipo para respuestas de API de casos destacados
 */
export interface FeaturedCasesResponse {
  cases: FeaturedCase[];
  success: boolean;
  error?: string;
}

/**
 * Tipo para los datos de Case Study que vienen de la API
 * Este tipo se usa para mapear los datos que vienen de la API a la estructura interna
 */
export interface ApiMediaItem {
  id?: string | number;
  type: string;
  url: string;
  videoType?: string;
  thumbnailUrl?: string;
  alt: string;
  width: number;
  height: number;
  order: number;
  displayMode?: string;
}

export interface ApiCaseStudy {
  id: string | number;
  title: string;
  client: string;
  description: string;
  description2: string;
  mediaItems: ApiMediaItem[];
  tags: string | string[];
  order: number;
  slug: string;
  status: string;
  featured: boolean;
  featured_order?: number;
  featuredOrder?: number;
  created_at?: string;
  updated_at?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Función para normalizar un ApiCaseStudy a CaseStudy
 * Esta función garantiza que los datos de la API se conviertan correctamente
 * al formato interno, manejando las diferencias de nomenclatura
 */
export function normalizeCaseStudy(apiCase: ApiCaseStudy): CaseStudy {
  // Normalizar tags (pueden venir como string o array)
  const tags = typeof apiCase.tags === 'string' 
    ? apiCase.tags.split(',').map(tag => tag.trim()) 
    : Array.isArray(apiCase.tags) ? apiCase.tags : [];

  // Normalizar mediaItems
  const mediaItems = (apiCase.mediaItems ?? []).map(item => {
    // Validamos el tipo de video para asegurar compatibilidad con el tipo MediaItem
    let validVideoType: 'vimeo' | 'youtube' | 'local' | null = null;
    if (item.videoType === 'vimeo' || item.videoType === 'youtube' || item.videoType === 'local') {
      validVideoType = item.videoType;
    }
    
    // Validamos el displayMode
    let validDisplayMode: 'single' | 'dual' | 'dual_left' | 'dual_right' | null = null;
    if (item.displayMode === 'single' || item.displayMode === 'dual' || 
        item.displayMode === 'dual_left' || item.displayMode === 'dual_right') {
      validDisplayMode = item.displayMode;
    }
    
    return {
      // Generamos un ID si no existe
      id: item.id !== undefined && item.id !== null ? String(item.id) : crypto.randomUUID(),
      type: item.type as 'image' | 'video',
      url: item.url,
      videoType: validVideoType,
      thumbnailUrl: item.thumbnailUrl ?? null,
      alt: item.alt ?? '',
      width: typeof item.width === 'number' && !isNaN(item.width) ? item.width : 0,
      height: typeof item.height === 'number' && !isNaN(item.height) ? item.height : 0,
      order: typeof item.order === 'number' && !isNaN(item.order) ? item.order : 0,
      displayMode: validDisplayMode,
    };
  });

  // Normalizar fechas
  const createdAt = apiCase.createdAt ?? apiCase.created_at ?? undefined;
  const updatedAt = apiCase.updatedAt ?? apiCase.updated_at ?? undefined;

  return {
    id: String(apiCase.id),
    title: apiCase.title,
    client: apiCase.client,
    description: apiCase.description,
    description2: apiCase.description2 ?? '',
    mediaItems,
    tags,
    order: typeof apiCase.order === 'number' && !isNaN(apiCase.order) ? apiCase.order : 0,
    slug: apiCase.slug,
    status: (apiCase.status !== undefined && apiCase.status !== '' ? apiCase.status : 'draft') as EntityStatus,
    featured: apiCase.featured === true,
    featuredOrder: typeof apiCase.featuredOrder === 'number' && !isNaN(apiCase.featuredOrder) ? apiCase.featuredOrder : 
                 (typeof apiCase.featured_order === 'number' && !isNaN(apiCase.featured_order) ? apiCase.featured_order : 0),
    createdAt,
    updatedAt,
  };
}
