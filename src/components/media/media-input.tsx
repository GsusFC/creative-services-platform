'use client';

import React, { useState, useRef } from 'react';
import { Upload, Link, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { MediaItem, MediaItemType } from '@/lib/case-studies/media-types';
import { MediaApiService } from '@/lib/case-studies/media-api-service';

interface MediaInputProps {
  value?: MediaItem;
  onChange: (value: Partial<MediaItem>) => void;
  onRemove?: () => void;
  allowFileUpload?: boolean;
  allowUrl?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function MediaInput({
  value,
  onChange,
  onRemove,
  allowFileUpload = true,
  allowUrl = true,
  label = 'Imagen',
  placeholder = 'Selecciona una imagen o introduce una URL',
  className = '',
}: MediaInputProps) {
  const [activeTab, setActiveTab] = useState<MediaItemType>(value?.type || (allowFileUpload ? 'file' : 'url'));
  const [previewUrl, setPreviewUrl] = useState<string | null>(value?.source || null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Manejar cambio de tipo (file/url)
  const handleTypeChange = (type: MediaItemType) => {
    setActiveTab(type);
    onChange({ type });
    
    // Limpiar la previsualización y el valor si cambiamos de tipo
    setPreviewUrl(null);
    onChange({ source: '' });
  };

  // Manejar subida de archivo
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Crear URL de previsualización temporal
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Indicar que estamos subiendo
      setIsUploading(true);
      setUploadProgress(10);
      
      try {
        // Simular progreso de carga
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 200);
        
        // Subir el archivo a través de la API
        const result = await MediaApiService.uploadFile(
          file,
          'temp', // Slug temporal, se actualizará cuando se guarde el caso de estudio
          value?.alt || '',
          value?.caption || ''
        );
        
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        if (result.success && result.mediaItem) {
          // Actualizar con los datos reales del servidor
          onChange({
            ...result.mediaItem,
            // Mantener la referencia al archivo local para la previsualización
            _file: file
          });
          
          // Actualizar la previsualización con la URL real
          setPreviewUrl(result.mediaItem.source);
        } else {
          // Mostrar error
          toast({
            title: 'Error al subir el archivo',
            description: result.message,
            variant: 'destructive'
          });
          
          // Limpiar la previsualización
          URL.revokeObjectURL(objectUrl);
          setPreviewUrl(null);
        }
      } catch (error) {
        console.error('Error al subir el archivo:', error);
        toast({
          title: 'Error al subir el archivo',
          description: error instanceof Error ? error.message : 'Error desconocido',
          variant: 'destructive'
        });
        
        // Limpiar la previsualización
        URL.revokeObjectURL(objectUrl);
        setPreviewUrl(null);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  // Manejar entrada de URL
  const handleUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPreviewUrl(url);
    
    // Actualizar temporalmente
    onChange({
      type: 'url',
      source: url,
    });
    
    // Si la URL está vacía, no hacer nada más
    if (!url) return;
    
    // Validar la URL
    try {
      new URL(url);
    } catch (error) {
      // No es una URL válida, no hacer nada más
      return;
    }
    
    // Crear el elemento multimedia en el servidor
    if (url && !isUploading && e.type === 'blur') {
      setIsUploading(true);
      
      try {
        const result = await MediaApiService.createMediaItemFromUrl(
          url,
          value?.alt || '',
          value?.caption || ''
        );
        
        if (result.success && result.mediaItem) {
          // Actualizar con los datos reales del servidor
          onChange(result.mediaItem);
        } else {
          // Mostrar error
          toast({
            title: 'Error al crear el elemento multimedia',
            description: result.message,
            variant: 'destructive'
          });
        }
      } catch (error) {
        console.error('Error al crear el elemento multimedia:', error);
        toast({
          title: 'Error al crear el elemento multimedia',
          description: error instanceof Error ? error.message : 'Error desconocido',
          variant: 'destructive'
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Manejar cambio de texto alternativo
  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      alt: e.target.value,
    });
  };

  // Manejar cambio de leyenda
  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      caption: e.target.value,
    });
  };

  // Abrir el selector de archivos
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && <Label>{label}</Label>}
      
      {/* Selector de tipo (archivo/URL) */}
      {allowFileUpload && allowUrl && (
        <Tabs value={activeTab} onValueChange={(v) => handleTypeChange(v as MediaItemType)} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Subir archivo
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              URL externa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="pt-4">
            <div className="flex flex-col gap-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBrowseClick}
                disabled={isUploading}
                className="w-full h-24 border-dashed flex flex-col items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Subiendo... {uploadProgress}%</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-6 w-6" />
                    <span>Seleccionar imagen</span>
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="url" className="pt-4">
            <div className="space-y-2">
              <Input
                type="url"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={value?.type === 'url' ? value.source : ''}
                onChange={handleUrlChange}
                onBlur={handleUrlChange}
                disabled={isUploading}
                className="w-full"
              />
              {isUploading && (
                <div className="flex items-center text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Verificando URL...</span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      {/* Si solo se permite un tipo, mostrar la entrada correspondiente */}
      {(!allowFileUpload || !allowUrl) && (
        <div className="w-full">
          {activeTab === 'file' && (
            <div className="flex flex-col gap-4">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBrowseClick}
                className="w-full h-24 border-dashed flex flex-col items-center justify-center gap-2"
              >
                <Upload className="h-6 w-6" />
                <span>Seleccionar imagen</span>
              </Button>
            </div>
          )}
          
          {activeTab === 'url' && (
            <Input
              type="url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={value?.type === 'url' ? value.source : ''}
              onChange={handleUrlChange}
              className="w-full"
            />
          )}
        </div>
      )}
      
      {/* Previsualización de la imagen */}
      {previewUrl && (
        <div className="relative">
          <div className="relative aspect-video bg-black/20 rounded-md overflow-hidden">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt={value?.alt || 'Vista previa'} 
                className="w-full h-full object-contain"
                onError={() => {
                  // Si la imagen no se puede cargar, mostrar un placeholder
                  setPreviewUrl(null);
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          
          {/* Botón para eliminar la imagen */}
          {onRemove && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={onRemove}
              className="absolute top-2 right-2 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      
      {/* Campos adicionales (alt, caption) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="alt-text">Texto alternativo</Label>
          <Input
            id="alt-text"
            type="text"
            placeholder="Descripción de la imagen"
            value={value?.alt || ''}
            onChange={handleAltChange}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="caption">Leyenda</Label>
          <Input
            id="caption"
            type="text"
            placeholder="Pie de foto"
            value={value?.caption || ''}
            onChange={handleCaptionChange}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}
