/**
 * Tipos y definiciones para el sistema de Case Studies
 */

// Tipos de media
export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  videoType?: 'vimeo' | 'local';
  thumbnailUrl?: string;
  alt: string;
  width: number; 
  height: number;
  order: number;
  displayMode?: 'single' | 'dual' | 'dual_left' | 'dual_right';
}

// Estructura principal de Case Study
export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  description: string; // Descripción corta para listados
  description2: string; // Descripción larga para página detalle
  mediaItems: MediaItem[];
  tags: string[];
  order: number;
  slug: string;
  status: 'draft' | 'published';
  featured: boolean; // Para mostrar en home
  featuredOrder: number; // Posición en el listado de la home (1-4)
  createdAt?: string; // Fecha de creación
  updatedAt?: string; // Fecha de última actualización
}

// Tipo para actualizar el estado de destacado
export interface FeaturedCaseUpdate {
  id: string;
  featured: boolean;
  featuredOrder: number;
}
