// Definición centralizada para MediaItem
export interface MediaItem {
  id?: string; // ID puede ser opcional si se genera en el backend o localmente
  url: string;
  alt: string;
  order: number;
  type?: 'image' | 'video';
  videoType?: 'vimeo' | 'local';
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  displayMode?: 'single' | 'dual' | 'dual_left' | 'dual_right';
  createdAt?: string; // Añadido por si se usa
  updatedAt?: string; // Añadido por si se usa
}
