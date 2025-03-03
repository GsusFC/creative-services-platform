'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  FileImage, 
  Film, 
  ExternalLink,
  X,
  Info,
  Youtube,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type MediaType = 'image' | 'video';

export interface MediaInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  helpText?: string;
}

export const MediaInput = ({
  label,
  value,
  onChange,
  required = false,
  placeholder = 'URL del archivo',
  className,
  helpText
}: MediaInputProps) => {
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Función de validación de URL
  const isValidURL = useCallback((url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  }, []);
  
  // Detectar automáticamente el tipo de medio basado en la URL
  useEffect(() => {
    if (!value) {
      setIsValidUrl(true);
      return;
    }
    
    // Validar formato de URL
    const isValid = isValidURL(value);
    setIsValidUrl(isValid);
    
    if (!isValid) return;
    
    // Limpiar cualquier timer anterior
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Detectar tipo de medio con un pequeño debounce
    timerRef.current = setTimeout(() => {
      // Comprobaciones de formato mejoradas
      const isVimeoUrl = /vimeo\.com\/(\d+)/.test(value);
      const isYoutubeUrl = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/.test(value);
      const isImageUrl = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(value);
      
      // Revisar dominios conocidos de CDNs de imágenes
      const isImageCdn = /imgix\.net|cloudinary\.com|images\.unsplash\.com|img\.youtube\.com/i.test(value);
      
      if (isVimeoUrl || isYoutubeUrl) {
        setMediaType('video');
      } else if (isImageUrl || isImageCdn) {
        setMediaType('image');
      }
      // Si no se puede determinar, mantener el tipo seleccionado por el usuario
    }, 300);
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, isValidURL]);

  // Extraer información de videos para embeds
  const getVideoEmbedUrl = useCallback((url: string) => {
    // Vimeo
    const vimeoMatches = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatches) {
      return {
        type: 'vimeo',
        embedUrl: `https://player.vimeo.com/video/${vimeoMatches[1]}?title=0&byline=0&portrait=0`
      };
    }
    
    // YouTube
    const youtubeMatches = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (youtubeMatches) {
      return {
        type: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${youtubeMatches[1]}?autoplay=0&modestbranding=1`
      };
    }
    
    return null;
  }, []);

  const handleMediaTypeChange = (type: MediaType) => {
    setMediaType(type);
    setPreviewError(null);
  };
  
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setPreviewError(null);
  }, []);
  
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    setPreviewError(`No se ha podido cargar la imagen: ${(e.target as HTMLImageElement).src}`);
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={`media-${label}`} className="block font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        
        <div className="flex bg-black/30 border border-white/10 rounded-md overflow-hidden">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleMediaTypeChange('image')}
            className={`px-3 h-9 rounded-none ${
              mediaType === 'image' 
                ? 'bg-indigo-950/40 text-indigo-200' 
                : 'hover:bg-indigo-950/20'
            }`}
          >
            <FileImage className="h-4 w-4 mr-1" />
            <span>Imagen</span>
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleMediaTypeChange('video')}
            className={`px-3 h-9 rounded-none ${
              mediaType === 'video' 
                ? 'bg-indigo-950/40 text-indigo-200' 
                : 'hover:bg-indigo-950/20'
            }`}
          >
            <Film className="h-4 w-4 mr-1" />
            <span>Video</span>
          </Button>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <div className="flex-grow">
          <Input
            id={`media-${label}`}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setPreviewError(null);
            }}
            placeholder={mediaType === 'image' 
              ? "URL de la imagen (jpg, png, gif, webp...)" 
              : "URL del video (Vimeo, YouTube)"}
            className="bg-black/50 border-white/10 w-full"
          />
          
          {helpText && (
            <div className="flex items-start mt-1 text-xs text-gray-400">
              <Info className="h-3 w-3 mr-1 mt-0.5" />
              <span>{helpText}</span>
            </div>
          )}
        </div>
        
        {value && (
          <Button 
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              onChange('');
              setPreviewError(null);
            }}
            className="bg-black/20 hover:bg-black/40 border border-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        {value && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => window.open(value, '_blank')}
            className="border-white/10 hover:bg-indigo-950/30"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Previsualización */}
      {value && (
        <div className="mt-2 rounded-md overflow-hidden bg-black/20 border border-white/10">
          {mediaType === 'image' ? (
            <div className="aspect-video relative flex items-center justify-center">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-300" />
                </div>
              )}
              <img
                src={value}
                alt={`Previsualización de ${label}`}
                className="max-h-full max-w-full object-contain"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              {previewError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-red-400 text-sm">
                  {previewError}
                </div>
              )}
              {!isValidUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-yellow-400 text-sm">
                  URL no válida. Verifica el formato.
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-300" />
                </div>
              )}
              
              {!isValidUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-yellow-400 text-sm">
                  URL no válida. Verifica el formato.
                </div>
              )}
              
              {isValidUrl && value && (() => {
                const videoInfo = getVideoEmbedUrl(value);
                
                if (videoInfo) {
                  return (
                    <iframe
                      src={videoInfo.embedUrl}
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      onLoad={() => setIsLoading(false)}
                      onError={() => {
                        setIsLoading(false);
                        setPreviewError('No se ha podido cargar el video');
                      }}
                    ></iframe>
                  );
                } else {
                  return (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-yellow-400 text-sm p-4 text-center">
                      <p className="mb-2">URL de video no soportada.</p>
                      <p>Formatos compatibles:</p>
                      <ul className="mt-1 list-disc list-inside">
                        <li>Vimeo: vimeo.com/123456789</li>
                        <li>YouTube: youtube.com/watch?v=abcdefghijk</li>
                      </ul>
                    </div>
                  );
                }
              })()}
              {previewError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-red-400 text-sm">
                  {previewError}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
