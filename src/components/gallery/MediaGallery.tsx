"use client";

import { MediaItem } from '@/types/case-study';
import SingleMediaModule from './SingleMediaModule';
import DualMediaModule from './DualMediaModule';

interface MediaGalleryProps {
  mediaItems: MediaItem[];
}

/**
 * Componente para mostrar una galería de elementos multimedia
 * Organiza automáticamente los elementos en formatos de uno o dos elementos
 */
const MediaGallery = ({ mediaItems }: MediaGalleryProps) => {
  // Ordenar los elementos por su propiedad order
  const sortedMedia = [...mediaItems].sort((a, b) => a.order - b.order);
  
  // Renderizar la galería
  return (
    <div className="w-full space-y-16">
      {renderMediaGroups(sortedMedia)}
    </div>
  );
};

/**
 * Organiza los elementos multimedia en grupos de uno o dos elementos
 */
const renderMediaGroups = (mediaItems: MediaItem[]) => {
  const groups = [];
  let currentIndex = 0;
  
  while (currentIndex < mediaItems.length) {
    // Si hay dos elementos disponibles y ambos tienen display_mode='dual' o uno está marcado como 'dual_left' y otro como 'dual_right'
    if (
      currentIndex + 1 < mediaItems.length && 
      (
        (mediaItems[currentIndex].displayMode === 'dual' && mediaItems[currentIndex + 1].displayMode === 'dual') ||
        (mediaItems[currentIndex].displayMode === 'dual_left' && mediaItems[currentIndex + 1].displayMode === 'dual_right') ||
        (mediaItems[currentIndex].displayMode === 'dual_right' && mediaItems[currentIndex + 1].displayMode === 'dual_left')
      )
    ) {
      // Ordenar correctamente si uno es dual_left y otro dual_right
      let leftMedia, rightMedia;
      
      if (mediaItems[currentIndex].displayMode === 'dual_left' || mediaItems[currentIndex + 1].displayMode === 'dual_right') {
        leftMedia = mediaItems[currentIndex];
        rightMedia = mediaItems[currentIndex + 1];
      } else if (mediaItems[currentIndex].displayMode === 'dual_right' || mediaItems[currentIndex + 1].displayMode === 'dual_left') {
        leftMedia = mediaItems[currentIndex + 1];
        rightMedia = mediaItems[currentIndex];
      } else {
        // Ambos son 'dual', usar el orden actual
        leftMedia = mediaItems[currentIndex];
        rightMedia = mediaItems[currentIndex + 1];
      }
      
      groups.push(
        <DualMediaModule 
          key={`dual-${currentIndex}`}
          leftMedia={leftMedia} 
          rightMedia={rightMedia}
        />
      );
      
      currentIndex += 2;
    } else {
      // Mostrar un único elemento
      groups.push(
        <SingleMediaModule 
          key={`single-${currentIndex}`}
          media={mediaItems[currentIndex]} 
        />
      );
      
      currentIndex += 1;
    }
  }
  
  return groups;
};

export default MediaGallery;
