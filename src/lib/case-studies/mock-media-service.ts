import { v4 as uuidv4 } from 'uuid';
import { 
  MediaItem, 
  MediaSection, 
  CreateMediaItemData, 
  CreateMediaSectionData 
} from './media-types';
import { MockFileService } from './mock-file-service';

/**
 * Servicio mock para gestionar elementos multimedia de casos de estudio
 */
export class MockMediaService {
  // Almacenamiento en memoria para los elementos multimedia
  private static readonly mediaItems: Record<string, MediaItem> = {};
  
  // Almacenamiento en memoria para las secciones multimedia
  private static readonly mediaSections: Record<string, MediaSection> = {};
  
  /**
   * Crea un nuevo elemento multimedia
   * @param data Datos del elemento multimedia
   * @returns El elemento multimedia creado
   */
  static async createMediaItem(data: CreateMediaItemData): Promise<MediaItem> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const mediaItem: MediaItem = {
      id,
      type: data.type,
      source: data.source,
      alt: data.alt || '',
      caption: data.caption || '',
      width: data.width,
      height: data.height,
      createdAt: now,
      updatedAt: now
    };
    
    this.mediaItems[id] = mediaItem;
    
    return mediaItem;
  }
  
  /**
   * Crea un nuevo elemento multimedia a partir de un archivo
   * @param file Archivo a subir
   * @param slug Slug del caso de estudio
   * @param alt Texto alternativo
   * @param caption Leyenda
   * @returns El elemento multimedia creado
   */
  static async createMediaItemFromFile(
    file: File,
    slug: string,
    alt?: string,
    caption?: string
  ): Promise<MediaItem> {
    // "Guardar" el archivo con el servicio mock
    const fileUrl = await MockFileService.saveFile(file, slug);
    
    // Crear el elemento multimedia
    return this.createMediaItem({
      type: 'file',
      source: fileUrl,
      alt,
      caption
    });
  }
  
  /**
   * Crea un nuevo elemento multimedia a partir de una URL
   * @param url URL de la imagen
   * @param alt Texto alternativo
   * @param caption Leyenda
   * @returns El elemento multimedia creado
   */
  static async createMediaItemFromUrl(
    url: string,
    alt?: string,
    caption?: string
  ): Promise<MediaItem> {
    // Crear el elemento multimedia
    return this.createMediaItem({
      type: 'url',
      source: url,
      alt,
      caption
    });
  }
  
  /**
   * Actualiza un elemento multimedia existente
   * @param id ID del elemento multimedia
   * @param data Datos actualizados
   * @returns El elemento multimedia actualizado
   */
  static async updateMediaItem(
    id: string,
    data: Partial<CreateMediaItemData>
  ): Promise<MediaItem | null> {
    if (!this.mediaItems[id]) {
      return null;
    }
    
    this.mediaItems[id] = {
      ...this.mediaItems[id],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    return this.mediaItems[id];
  }
  
  /**
   * Elimina un elemento multimedia
   * @param id ID del elemento multimedia
   * @returns true si se eliminó correctamente
   */
  static async deleteMediaItem(id: string): Promise<boolean> {
    if (!this.mediaItems[id]) {
      return false;
    }
    
    // Si es un archivo, "eliminarlo" del sistema de archivos
    if (this.mediaItems[id].type === 'file') {
      MockFileService.deleteFile(this.mediaItems[id].source);
    }
    
    delete this.mediaItems[id];
    
    return true;
  }
  
  /**
   * Obtiene un elemento multimedia por su ID
   * @param id ID del elemento multimedia
   * @returns El elemento multimedia o null si no existe
   */
  static async getMediaItem(id: string): Promise<MediaItem | null> {
    return this.mediaItems[id] || null;
  }
  
  /**
   * Crea una nueva sección multimedia
   * @param data Datos de la sección multimedia
   * @returns La sección multimedia creada
   */
  static async createMediaSection(data: CreateMediaSectionData): Promise<MediaSection> {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    // Crear los elementos multimedia
    const items: MediaItem[] = [];
    
    for (const itemData of data.items) {
      const mediaItem = await this.createMediaItem(itemData);
      items.push(mediaItem);
    }
    
    const mediaSection: MediaSection = {
      id,
      layout: data.layout,
      items,
      title: data.title || '',
      description: data.description || '',
      createdAt: now,
      updatedAt: now
    };
    
    this.mediaSections[id] = mediaSection;
    
    return mediaSection;
  }
  
  /**
   * Actualiza una sección multimedia existente
   * @param id ID de la sección multimedia
   * @param data Datos actualizados
   * @returns La sección multimedia actualizada
   */
  static async updateMediaSection(
    id: string,
    data: Partial<CreateMediaSectionData>
  ): Promise<MediaSection | null> {
    if (!this.mediaSections[id]) {
      return null;
    }
    
    // Actualizar los elementos multimedia si se proporcionan
    if (data.items) {
      // Eliminar los elementos multimedia anteriores
      for (const item of this.mediaSections[id].items) {
        await this.deleteMediaItem(item.id);
      }
      
      // Crear los nuevos elementos multimedia
      const items: MediaItem[] = [];
      
      for (const itemData of data.items) {
        const mediaItem = await this.createMediaItem(itemData);
        items.push(mediaItem);
      }
      
      this.mediaSections[id] = {
        ...this.mediaSections[id],
        ...data,
        items,
        updatedAt: new Date().toISOString()
      };
    } else {
      this.mediaSections[id] = {
        ...this.mediaSections[id],
        ...data,
        updatedAt: new Date().toISOString()
      };
    }
    
    return this.mediaSections[id];
  }
  
  /**
   * Elimina una sección multimedia
   * @param id ID de la sección multimedia
   * @returns true si se eliminó correctamente
   */
  static async deleteMediaSection(id: string): Promise<boolean> {
    if (!this.mediaSections[id]) {
      return false;
    }
    
    // Eliminar los elementos multimedia
    for (const item of this.mediaSections[id].items) {
      await this.deleteMediaItem(item.id);
    }
    
    delete this.mediaSections[id];
    
    return true;
  }
  
  /**
   * Obtiene una sección multimedia por su ID
   * @param id ID de la sección multimedia
   * @returns La sección multimedia o null si no existe
   */
  static async getMediaSection(id: string): Promise<MediaSection | null> {
    return this.mediaSections[id] || null;
  }
  
  /**
   * Obtiene todas las secciones multimedia
   * @returns Lista de secciones multimedia
   */
  static async getAllMediaSections(): Promise<MediaSection[]> {
    return Object.values(this.mediaSections);
  }
}
