"use client";

import { MediaItem } from '@/types/media'; // Importar desde la nueva ubicación
import VideoPlayer from './VideoPlayer';
import Image from 'next/image';

// Eliminar definición local

interface SingleMediaProps {
  media: MediaItem;
}

const SingleMediaModule = ({ media }: SingleMediaProps) => {
  // Determinar si es un video o una imagen
  const isVideo = media.type === 'video';

  return (
    <div className="w-full relative overflow-hidden">
      {isVideo ? (
        <VideoPlayer
          url={media.url}
          thumbnailUrl={media.thumbnailUrl}
          videoType={media.videoType || 'local'}
          alt={media.alt}
          width={media.width ?? 1920} // Default width
          height={media.height ?? 1080} // Default height
        />
      ) : (
        <div className="relative aspect-video bg-gray-100 w-full overflow-hidden">
          <Image
            src={media.url}
            alt={media.alt || 'Imagen del caso de estudio'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Descripción opcional */}
      {media.alt && (
        <p className="mt-3 text-sm text-gray-600 font-mono">{media.alt}</p>
      )}
    </div>
  );
};

export default SingleMediaModule;
