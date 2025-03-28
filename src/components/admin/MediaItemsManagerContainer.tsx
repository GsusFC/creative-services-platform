'use client'

import React, { useEffect } from 'react';
import { MediaItem } from '@/types/media'; // Importar desde la nueva ubicación
import MediaItemsManager from './MediaItemsManager';
import { useMediaItems } from '@/hooks/useMediaItems';

// Eliminar definición local

interface MediaItemsManagerContainerProps {
  initialItems?: MediaItem[];
  onChange: (items: MediaItem[]) => void;
}

const MediaItemsManagerContainer: React.FC<MediaItemsManagerContainerProps> = ({
  initialItems = [],
  onChange
}) => {
  const {
    mediaItems,
    loading,
    error,
    setMediaItems
    // Las siguientes funciones las manejamos a través del componente interno
    // addMediaItem,
    // removeMediaItem,
    // moveItemUp,
    // moveItemDown,
  } = useMediaItems(initialItems);

  // Sincronizar el estado con los items iniciales cuando cambian
  useEffect(() => {
    // Comprobación más robusta para evitar bucles infinitos si initialItems cambia frecuentemente
    if (JSON.stringify(initialItems) !== JSON.stringify(mediaItems)) {
      setMediaItems(initialItems);
    }
  }, [initialItems, mediaItems, setMediaItems]); // Incluir mediaItems en las dependencias

  // Llamar al callback onChange cuando cambian los items gestionados por el hook
  useEffect(() => {
    // Evitamos actualizar en la carga inicial o si los items no han cambiado realmente
    // Comparamos con initialItems para asegurar que el cambio no es solo la sincronización inicial
    if (mediaItems !== initialItems && JSON.stringify(mediaItems) !== JSON.stringify(initialItems)) {
       onChange(mediaItems);
    }
  }, [mediaItems, onChange, initialItems]); // Depender de mediaItems

  // Handler para manejar los cambios de la UI y propagarlos hacia el hook
  const handleMediaItemsChange = (newItems: MediaItem[]) => {
    setMediaItems(newItems);
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <MediaItemsManager
        mediaItems={mediaItems}
        onChange={handleMediaItemsChange}
      />

      {loading && (
        <div className="mt-4 text-sm text-gray-400">
          Procesando cambios...
        </div>
      )}
    </div>
  );
};

export default MediaItemsManagerContainer;
