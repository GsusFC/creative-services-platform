"use client";

import { MediaItem } from '@/types/media'; // Importar desde la nueva ubicación
import VideoPlayer from './VideoPlayer';
import Image from 'next/image';

// Eliminar definición local

interface DualMediaProps {
  leftMedia: MediaItem;
  rightMedia: MediaItem;
}

const DualMediaModule = ({ leftMedia, rightMedia }: DualMediaProps) => {
  const isLeftVideo = leftMedia.type === 'video';
  const isRightVideo = rightMedia.type === 'video';

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
      {/* Elemento izquierdo */}
      <div className="w-full relative overflow-hidden">
        {isLeftVideo ? (
          <VideoPlayer
            url={leftMedia.url}
            thumbnailUrl={leftMedia.thumbnailUrl}
            videoType={leftMedia.videoType || 'local'}
            alt={leftMedia.alt}
            width={leftMedia.width ?? 1920} // Default width
            height={leftMedia.height ?? 1080} // Default height
          />
        ) : (
          <div className="relative aspect-video bg-gray-100 w-full overflow-hidden">
            <Image
              src={leftMedia.url}
              alt={leftMedia.alt || 'Imagen del caso de estudio'}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Descripción opcional */}
        {leftMedia.alt && (
          <p className="mt-3 text-sm text-gray-600 font-mono">{leftMedia.alt}</p>
        )}
      </div>

      {/* Elemento derecho */}
      <div className="w-full relative overflow-hidden">
        {isRightVideo ? (
          <VideoPlayer
            url={rightMedia.url}
            thumbnailUrl={rightMedia.thumbnailUrl}
            videoType={rightMedia.videoType || 'local'}
            alt={rightMedia.alt}
            width={rightMedia.width ?? 1920} // Default width
            height={rightMedia.height ?? 1080} // Default height
          />
        ) : (
          <div className="relative aspect-video bg-gray-100 w-full overflow-hidden">
            <Image
              src={rightMedia.url}
              alt={rightMedia.alt || 'Imagen del caso de estudio'}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Descripción opcional */}
        {rightMedia.alt && (
          <p className="mt-3 text-sm text-gray-600 font-mono">{rightMedia.alt}</p>
        )}
      </div>
    </div>
  );
};

export default DualMediaModule;
