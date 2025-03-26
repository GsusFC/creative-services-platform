'use client'

import { useEffect, useState } from 'react';

interface MediaItemProps {
  url: string;
  alt: string;
  type: string;
  videoType?: string | undefined;
}

export function MediaItem({ url, alt, type, videoType }: MediaItemProps) {
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  // Validar si la URL del S3 ha expirado
  const isExpiredS3Url = url && typeof url === 'string' && url.includes('X-Amz-Expires') && url.includes('prod-files-secure.s3.us-west-2.amazonaws.com');

  // Función para renderizar la imagen con manejo de errores
  const renderImage = () => {
    return (
      <div className="space-y-2 relative">
        <img 
          src={url} 
          alt={alt || ''} 
          className={`w-full ${error ? 'opacity-30' : ''}`}
          onError={(e) => {
            console.error(`Error loading image: ${url}`);
            setError(`Error al cargar la imagen. Posible URL expirada.`);
          }}
          onLoad={() => setLoaded(true)}
        />
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white p-2 text-red-500 rounded shadow text-center">
              {error}
              <p className="text-xs text-gray-500 mt-1">La URL de Amazon S3 puede haber expirado</p>
            </div>
          </div>
        )}
        
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-blue-100 p-2 rounded">Cargando...</div>
          </div>
        )}
        
        <p className="text-sm text-gray-600">{alt}</p>
      </div>
    );
  };

  // Función para renderizar video según el tipo
  const renderVideo = () => {
    if (videoType === 'vimeo') {
      // Extraer el ID del video de Vimeo
      const vimeoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      if (vimeoId) {
        return (
          <div className="relative pt-[56.25%]"> {/* Aspect ratio 16:9 */}
            <iframe 
              src={`https://player.vimeo.com/video/${vimeoId}`} 
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen
            />
          </div>
        );
      }
    }

    // Fallback para otros tipos de video o URLs inválidas
    return (
      <div className="p-4 bg-gray-100 rounded">
        <p>Video URL: {url}</p>
        {videoType && <p className="text-sm text-gray-500">Tipo: {videoType}</p>}
        <p className="text-sm text-gray-600">{alt}</p>
      </div>
    );
  };

  if (type === 'image') {
    return renderImage();
  } else if (type === 'video') {
    return renderVideo();
  }

  // Fallback para tipos desconocidos
  return (
    <div className="p-4 bg-gray-100 rounded">
      <p>Tipo desconocido: {type}</p>
      <p>URL: {url}</p>
      <p>Alt: {alt}</p>
    </div>
  );
}
