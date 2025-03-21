/**
 * Tipos y definiciones para el sistema de Case Studies
 */

// Tipos de media
export interface MediaItem {
  type: 'image' | 'video' | 'avatar';
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
  title: string; // Brand Name en Notion
  client: string; // Igual que title
  description: string;
  tagline: string;
  closingClaim: string;
  mediaItems: MediaItem[];
  tags: string[]; // Services en Notion
  order: number;
  slug: string;
  website?: string | undefined;
  status: 'draft' | 'published'; // Gestionado en la aplicación
  featured: boolean; // Gestionado en la aplicación
  featuredOrder: number; // Gestionado en la aplicación
  createdAt: string;
  updatedAt: string;
  nextProject?: {
    slug: string;
    title?: string;
  };
  synced?: boolean;
}

// Tipo para actualizar el estado de destacado
export interface FeaturedCaseUpdate {
  id: string;
  featured: boolean;
  featuredOrder: number;
}
