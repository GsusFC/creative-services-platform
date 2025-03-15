'use client'

import React, { useEffect } from 'react';
import { MediaItem } from '@/types/case-study';
import MediaItemsManager from './MediaItemsManager';
import { useMediaItems } from '@/hooks/useMediaItems';

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
    if (JSON.stringify(initialItems) !== JSON.stringify(mediaItems)) {
      setMediaItems(initialItems);
    }
  }, [initialItems, mediaItems, setMediaItems]);
  
  // Llamar al callback onChange cuando cambian los items
  useEffect(() => {
    // Evitamos actualizar en la carga inicial, solo cuando hay cambios reales
    if (mediaItems.length > 0 && JSON.stringify(initialItems) !== JSON.stringify(mediaItems)) {
      onChange(mediaItems);
    }
  }, [mediaItems, onChange, initialItems]);
  
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
