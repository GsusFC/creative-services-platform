import axios from 'axios';
import { MediaItem } from '@/types/media'; // Importar desde la nueva ubicación
import { v4 as uuidv4 } from 'uuid';

// Eliminar definición local

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';
const TIMEOUT = 10000; // 10 segundos de timeout para todas las solicitudes

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Obtener todas las imágenes disponibles en la biblioteca de medios
 */
export const getAllMediaItems = async (): Promise<MediaItem[]> => {
  try {
    const response = await api.get('/media-items');
    return response.data;
  } catch (error) {
    console.error('Error al obtener elementos multimedia:', error instanceof Error ? error.message : 'Error desconocido');
    // Fallback: devolver array vacío
    return [];
  }
};

/**
 * Crear un nuevo elemento multimedia
 */
export const createMediaItem = async (mediaItemData: Omit<MediaItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MediaItem> => { // Ajustar Omit
  try {
    const response = await api.post('/media-items', mediaItemData);
    return response.data;
  } catch (error) {
    console.error('Error al crear elemento multimedia:', error instanceof Error ? error.message : 'Error desconocido');

    // Fallback: simulamos la creación local con un ID generado
    return {
      id: uuidv4(),
      ...mediaItemData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
};

/**
 * Actualizar un elemento multimedia existente
 */
export const updateMediaItem = async (id: string, mediaItemData: Partial<MediaItem>): Promise<MediaItem> => {
  try {
    const response = await api.put(`/media-items/${id}`, mediaItemData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar elemento multimedia con ID ${id}:`, error instanceof Error ? error.message : 'Error desconocido');

    // Fallback: simulamos la actualización local
    // Asegurarse de que el objeto devuelto cumpla con la interfaz MediaItem
    const updatedData = { ...mediaItemData };
    delete updatedData.id; // No incluir id en los datos parciales

    return {
      id,
      url: updatedData.url || '', // Proveer valor default si es necesario
      alt: updatedData.alt || '', // Proveer valor default si es necesario
      order: updatedData.order || 0, // Proveer valor default si es necesario
      ...updatedData, // Aplicar el resto de los datos parciales
      updatedAt: new Date().toISOString()
    };
  }
};


/**
 * Eliminar un elemento multimedia
 */
export const deleteMediaItem = async (id: string): Promise<void> => {
  try {
    await api.delete(`/media-items/${id}`);
  } catch (error) {
    console.error(`Error al eliminar elemento multimedia con ID ${id}:`, error instanceof Error ? error.message : 'Error desconocido');
    // No hacemos nada en el fallback, suponemos que la eliminación se realizó correctamente
  }
};

/**
 * Reordenar elementos multimedia
 */
export const reorderMediaItems = async (mediaItems: MediaItem[]): Promise<MediaItem[]> => {
  try {
    const response = await api.put('/media-items/reorder', { mediaItems });
    return response.data;
  } catch (error) {
    console.error('Error al reordenar elementos multimedia:', error instanceof Error ? error.message : 'Error desconocido');

    // Fallback: devolvemos los elementos con orden actualizado
    return mediaItems;
  }
};
