import { useState, useCallback } from 'react';
import { MediaItem } from '@/types/case-study';
import { v4 as uuidv4 } from 'uuid';
import * as mediaItemsService from '@/api/mediaItemsService';

interface MediaItemsState {
  mediaItems: MediaItem[];
  loading: boolean;
  error: string | null;
}

export const useMediaItems = (initialItems: MediaItem[] = []) => {
  const [state, setState] = useState<MediaItemsState>({
    mediaItems: initialItems,
    loading: false,
    error: null
  });

  // Añadir un nuevo elemento multimedia
  const addMediaItem = useCallback(async (newItemData: Omit<MediaItem, 'id'>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Validación local básica
      if (!newItemData.url?.trim()) {
        throw new Error('La URL es obligatoria');
      }
      
      if (!newItemData.alt?.trim()) {
        throw new Error('El texto alternativo es obligatorio');
      }
      
      // Aseguramos que el orden sea correcto
      const order = newItemData.order ?? state.mediaItems.length;
      
      // Para simplificar, creamos el ítem localmente y evitamos la llamada API
      // en una implementación real, usaríamos: const newItem = await mediaItemsService.createMediaItem({ ...newItemData, order });
      const newItem: MediaItem = {
        id: uuidv4(),
        ...newItemData,
        order
      };
      
      const updatedItems = [...state.mediaItems, newItem].sort((a, b) => a.order - b.order);
      setState({ mediaItems: updatedItems, loading: false, error: null });
      return newItem;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al agregar elemento multimedia';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return null;
    }
  }, [state.mediaItems]);

  // Eliminar un elemento multimedia
  const removeMediaItem = useCallback(async (index: number) => {
    if (index < 0 || index >= state.mediaItems.length) {
      setState(prev => ({ ...prev, error: 'Índice no válido para eliminar' }));
      return false;
    }
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const itemToRemove = state.mediaItems[index];
      
      // En una implementación real, llamaríamos a la API
      // await mediaItemsService.deleteMediaItem(itemToRemove.id);
      
      const updatedItems = state.mediaItems.filter((_, i) => i !== index);
      
      // Actualizar el orden de los elementos restantes
      const reorderedItems = updatedItems.map((item, i) => ({
        ...item,
        order: i
      }));
      
      setState({ mediaItems: reorderedItems, loading: false, error: null });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar elemento multimedia';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return false;
    }
  }, [state.mediaItems]);

  // Reordenar elementos multimedia (mover hacia arriba)
  const moveItemUp = useCallback(async (index: number) => {
    if (index <= 0 || index >= state.mediaItems.length) {
      return false;
    }
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const updatedItems = [...state.mediaItems];
      
      // Intercambiar órdenes
      const temp = updatedItems[index - 1].order;
      updatedItems[index - 1].order = updatedItems[index].order;
      updatedItems[index].order = temp;
      
      // Ordenar array según el orden
      const sortedItems = updatedItems.sort((a, b) => a.order - b.order);
      
      // En una implementación real, sincronizaríamos con la API
      // await mediaItemsService.reorderMediaItems(sortedItems);
      
      setState({ mediaItems: sortedItems, loading: false, error: null });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al mover elemento hacia arriba';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return false;
    }
  }, [state.mediaItems]);

  // Reordenar elementos multimedia (mover hacia abajo)
  const moveItemDown = useCallback(async (index: number) => {
    if (index < 0 || index >= state.mediaItems.length - 1) {
      return false;
    }
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const updatedItems = [...state.mediaItems];
      
      // Intercambiar órdenes
      const temp = updatedItems[index + 1].order;
      updatedItems[index + 1].order = updatedItems[index].order;
      updatedItems[index].order = temp;
      
      // Ordenar array según el orden
      const sortedItems = updatedItems.sort((a, b) => a.order - b.order);
      
      // En una implementación real, sincronizaríamos con la API
      // await mediaItemsService.reorderMediaItems(sortedItems);
      
      setState({ mediaItems: sortedItems, loading: false, error: null });
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al mover elemento hacia abajo';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      return false;
    }
  }, [state.mediaItems]);

  // Actualizar la lista completa de elementos multimedia
  const setMediaItems = useCallback((newItems: MediaItem[]) => {
    setState({ mediaItems: newItems, loading: false, error: null });
  }, []);

  return {
    ...state,
    addMediaItem,
    removeMediaItem,
    moveItemUp,
    moveItemDown,
    setMediaItems
  };
};
