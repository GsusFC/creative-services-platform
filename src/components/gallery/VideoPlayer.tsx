"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface VideoPlayerProps {
  url: string;
  thumbnailUrl?: string;
  videoType?: 'vimeo' | 'local';
  title?: string;
  alt?: string;
  autoPlay?: boolean;
  loop?: boolean;
  width: number;
  height: number;
  className?: string;
}

/**
 * Componente para reproducir videos locales o de Vimeo
 * Admite URL directas o IDs de Vimeo
 */
const VideoPlayer = ({
  url,
  thumbnailUrl,
  videoType = 'local',
  title = '',
  alt = '',
  autoPlay = false,
  loop = false,
  width = 1920,
  height = 1080,
  className = ''
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Función para obtener el ID de Vimeo desde la URL completa
  const getVimeoId = (url: string) => {
    // Si ya es un ID, lo devolvemos directamente
    if (/^\d+$/.test(url)) return url;
    
    // Extraer ID de una URL completa de Vimeo
    const match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/|vimeo\.com\/channels\/(?:\w+\/)?|vimeo\.com\/groups\/(?:[^\/]*)\/videos\/|vimeo\.com\/video\/)(\d+)(?:$|\/|\?|#)/);
    return match ? match[1] : url;
  };

  // Generar la URL de Vimeo para el iframe
  const getVimeoUrl = (url: string) => {
    const vimeoId = getVimeoId(url);
    return `https://player.vimeo.com/video/${vimeoId}?autoplay=${autoPlay ? 1 : 0}&loop=${loop ? 1 : 0}&title=0&byline=0&portrait=0`;
  };

  // Manejar el click en el video o thumbnail
  const handleVideoClick = () => {
    if (videoType === 'local' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (videoType === 'vimeo' && !isPlaying) {
      setIsPlaying(true);
    }
  };

  // Inicializar el video local cuando se monta el componente
  useEffect(() => {
    if (videoType === 'local' && videoRef.current) {
      if (autoPlay) {
        videoRef.current.play();
      }
      videoRef.current.addEventListener('loadeddata', () => {
        setIsLoaded(true);
      });
    }
    
    return () => {
      if (videoType === 'local' && videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', () => {
          setIsLoaded(true);
        });
      }
    };
  }, [autoPlay, videoType]);

  // Renderizar el reproductor adecuado según el tipo
  if (videoType === 'vimeo') {
    return (
      <div 
        className={`relative w-full overflow-hidden bg-black ${className}`}
        style={{ aspectRatio: `${width}/${height}` }}
      >
        {!isPlaying && thumbnailUrl ? (
          <div 
            className="cursor-pointer relative w-full h-full" 
            onClick={handleVideoClick}
          >
            <Image
              src={thumbnailUrl}
              alt={alt || title || "Video thumbnail"}
              fill
              sizes={`(max-width: 768px) 100vw, ${width}px`}
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-black bg-opacity-60 flex items-center justify-center">
                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-2"></div>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={getVimeoUrl(url)}
            allow="autoplay; fullscreen; picture-in-picture"
            className="absolute top-0 left-0 w-full h-full"
            style={{ border: 'none' }}
            title={title || "Vimeo video player"}
            onLoad={() => setIsLoaded(true)}
          ></iframe>
        )}
      </div>
    );
  }

  // Reproductor local
  return (
    <div 
      className={`relative w-full overflow-hidden bg-black ${className}`}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      {!isPlaying && thumbnailUrl ? (
        <div 
          className="cursor-pointer relative w-full h-full" 
          onClick={handleVideoClick}
        >
          <Image
            src={thumbnailUrl}
              alt={alt || title || "Video thumbnail"}
            fill
            sizes={`(max-width: 768px) 100vw, ${width}px`}
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-black bg-opacity-60 flex items-center justify-center">
              <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-2"></div>
            </div>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={url}
          className="w-full h-full cursor-pointer"
          onClick={handleVideoClick}
          controls={isPlaying}
          loop={loop}
          playsInline
          muted={autoPlay}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
