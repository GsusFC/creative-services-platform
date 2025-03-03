import { 
  MediaItem, 
  MediaSection, 
  CreateMediaItemData, 
  CreateMediaSectionData 
} from './media-types';

/**
 * Servicio para interactuar con la API de medios
 */
export class MediaApiService {
  /**
   * Sube un archivo y crea un elemento multimedia
   * @param file Archivo a subir
   * @param slug Slug del caso de estudio
   * @param alt Texto alternativo
   * @param caption Leyenda
   * @returns Respuesta de la API
   */
  static async uploadFile(
    file: File,
    slug: string,
    alt?: string,
    caption?: string
  ): Promise<{ success: boolean; message: string; mediaItem?: MediaItem; fileUrl?: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('slug', slug);
      
      if (alt) formData.append('alt', alt);
      if (caption) formData.append('caption', caption);
      
      const response = await fetch('/api/cms/case-studies/upload', {
        method: 'POST',
        body: formData,
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      return {
        success: false,
        message: `Error al subir el archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
  
  /**
   * Elimina un archivo y su elemento multimedia asociado
   * @param fileUrl URL del archivo
   * @param mediaItemId ID del elemento multimedia
   * @returns Respuesta de la API
   */
  static async deleteFile(
    fileUrl: string,
    mediaItemId?: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      let url = `/api/cms/case-studies/upload?fileUrl=${encodeURIComponent(fileUrl)}`;
      
      if (mediaItemId) {
        url += `&mediaItemId=${encodeURIComponent(mediaItemId)}`;
      }
      
      const response = await fetch(url, {
        method: 'DELETE',
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error al eliminar el archivo:', error);
      return {
        success: false,
        message: `Error al eliminar el archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
  
  /**
   * Crea un elemento multimedia a partir de una URL
   * @param url URL de la imagen
   * @param alt Texto alternativo
   * @param caption Leyenda
   * @returns Respuesta de la API
   */
  static async createMediaItemFromUrl(
    url: string,
    alt?: string,
    caption?: string
  ): Promise<{ success: boolean; message: string; mediaItem?: MediaItem }> {
    try {
      const response = await fetch('/api/cms/case-studies/media-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'url',
          source: url,
          alt,
          caption
        } as CreateMediaItemData),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error al crear el elemento multimedia:', error);
      return {
        success: false,
        message: `Error al crear el elemento multimedia: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
  
  /**
   * Obtiene un elemento multimedia por su ID
   * @param id ID del elemento multimedia
   * @returns Respuesta de la API
   */
  static async getMediaItem(
    id: string
  ): Promise<{ success: boolean; mediaItem?: MediaItem }> {
    try {
      const response = await fetch(`/api/cms/case-studies/media-items/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener el elemento multimedia:', error);
      return {
        success: false,
        message: `Error al obtener el elemento multimedia: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
  
  /**
   * Actualiza un elemento multimedia
   * @param id ID del elemento multimedia
   * @param data Datos actualizados
   * @returns Respuesta de la API
   */
  static async updateMediaItem(
    id: string,
    data: Partial<CreateMediaItemData>
  ): Promise<{ success: boolean; message: string; mediaItem?: MediaItem }> {
    try {
      const response = await fetch(`/api/cms/case-studies/media-items/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error al actualizar el elemento multimedia:', error);
      return {
        success: false,
        message: `Error al actualizar el elemento multimedia: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
  
  /**
   * Elimina un elemento multimedia
   * @param id ID del elemento multimedia
   * @returns Respuesta de la API
   */
  static async deleteMediaItem(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`/api/cms/case-studies/media-items/${id}`, {
        method: 'DELETE',
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error al eliminar el elemento multimedia:', error);
      return {
        success: false,
        message: `Error al eliminar el elemento multimedia: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
  
  /**
   * Crea una sección multimedia
   * @param data Datos de la sección multimedia
   * @returns Respuesta de la API
   */
  static async createMediaSection(
    data: CreateMediaSectionData
  ): Promise<{ success: boolean; message: string; mediaSection?: MediaSection }> {
    try {
      const response = await fetch('/api/cms/case-studies/media-sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error al crear la sección multimedia:', error);
      return {
        success: false,
        message: `Error al crear la sección multimedia: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
  
  /**
   * Obtiene todas las secciones multimedia
   * @returns Respuesta de la API
   */
  static async getAllMediaSections(): Promise<{ success: boolean; mediaSections?: MediaSection[] }> {
    try {
      const response = await fetch('/api/cms/case-studies/media-sections');
      return await response.json();
    } catch (error) {
      console.error('Error al obtener las secciones multimedia:', error);
      return {
        success: false,
        message: `Error al obtener las secciones multimedia: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
  
  /**
   * Obtiene una sección multimedia por su ID
   * @param id ID de la sección multimedia
   * @returns Respuesta de la API
   */
  static async getMediaSection(
    id: string
  ): Promise<{ success: boolean; mediaSection?: MediaSection }> {
    try {
      const response = await fetch(`/api/cms/case-studies/media-sections/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error al obtener la sección multimedia:', error);
      return {
        success: false,
        message: `Error al obtener la sección multimedia: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
  
  /**
   * Actualiza una sección multimedia
   * @param id ID de la sección multimedia
   * @param data Datos actualizados
   * @returns Respuesta de la API
   */
  static async updateMediaSection(
    id: string,
    data: Partial<CreateMediaSectionData>
  ): Promise<{ success: boolean; message: string; mediaSection?: MediaSection }> {
    try {
      const response = await fetch(`/api/cms/case-studies/media-sections/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error al actualizar la sección multimedia:', error);
      return {
        success: false,
        message: `Error al actualizar la sección multimedia: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
  
  /**
   * Elimina una sección multimedia
   * @param id ID de la sección multimedia
   * @returns Respuesta de la API
   */
  static async deleteMediaSection(
    id: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`/api/cms/case-studies/media-sections/${id}`, {
        method: 'DELETE',
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error al eliminar la sección multimedia:', error);
      return {
        success: false,
        message: `Error al eliminar la sección multimedia: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
    }
  }
}
