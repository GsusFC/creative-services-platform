'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  ImagePlus,
  Film,
  X,
  Trash2,
  ExternalLink,
  FileVideo,
  Link as LinkIcon,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface GalleryUploaderProps {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  required?: boolean;
  slug: string;
  className?: string;
  helpText?: string;
  maxItems?: number;
}

export function GalleryUploader({
  label,
  value = [],
  onChange,
  required = false,
  slug = '',
  className,
  helpText = 'Arrastra imágenes o haz clic para seleccionar',
  maxItems = 20
}: GalleryUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('upload');
  const [externalUrl, setExternalUrl] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  
  // Controlador para arrastrar y soltar
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      await handleFilesUpload(files);
    }
  };

  // Manejador para subir múltiples archivos a la vez
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      await handleFilesUpload(files);
      // Limpiar el input para permitir subir los mismos archivos nuevamente
      e.target.value = '';
    }
  };

  // Procesar varios archivos
  const handleFilesUpload = async (files: File[]) => {
    if (value.length + files.length > maxItems) {
      toast.error(`Solo puedes subir hasta ${maxItems} imágenes en total`);
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    const newUrls: string[] = [];
    const failedUploads: string[] = [];

    for (const file of files) {
      try {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          failedUploads.push(`${file.name} - tipo de archivo no permitido`);
          continue;
        }

        // Validar tamaño del archivo (máximo 15MB)
        if (file.size > 15 * 1024 * 1024) {
          failedUploads.push(`${file.name} - el archivo es demasiado grande (máximo 15MB)`);
          continue;
        }

        // Crear el formData para cada archivo
        const formData = new FormData();
        formData.append('file', file);
        
        // Incluir slug si existe
        if (slug) {
          formData.append('slug', slug);
        }

        // Enviar la solicitud a la API
        const response = await fetch('/api/cms/case-studies/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Error al subir el archivo');
        }

        newUrls.push(data.fileUrl);

      } catch (error) {
        console.error('Error al subir archivo:', error);
        failedUploads.push(file.name);
      }
    }

    // Actualizar las URLs con las nuevas
    if (newUrls.length > 0) {
      onChange([...value, ...newUrls]);
      toast.success(`${newUrls.length} ${newUrls.length === 1 ? 'archivo subido' : 'archivos subidos'} correctamente`);
    }

    // Mostrar errores si hubo
    if (failedUploads.length > 0) {
      setUploadError(`No se pudieron subir ${failedUploads.length} archivos`);
      toast.error(`Falló la subida de ${failedUploads.length} ${failedUploads.length === 1 ? 'archivo' : 'archivos'}`);
    }

    setIsUploading(false);
  };

  // Eliminar una imagen de la galería
  const handleRemoveImage = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
    toast.success('Imagen eliminada');
  };

  // Agregar URL externa
  const handleAddExternalUrl = () => {
    if (!externalUrl) return;
    
    try {
      // Validar la URL
      new URL(externalUrl);
      
      // Añadir la URL al array
      onChange([...value, externalUrl]);
      setExternalUrl('');
      toast.success('URL añadida correctamente');
    } catch (error) {
      toast.error('URL inválida', {
        description: 'Por favor, introduce una URL válida'
      });
    }
  };

  // Agregar URL de video
  const handleAddVideoUrl = () => {
    if (!videoUrl) return;
    
    try {
      // Validar si es una URL
      if (videoUrl.startsWith('http')) {
        new URL(videoUrl);
      } else {
        // Para rutas de archivo locales, verificamos que tenga extensión válida
        if (!videoUrl.match(/\.(mp4|webm|ogg|mov)$/i)) {
          throw new Error('Formato de video no válido');
        }
      }
      
      // Añadir la URL al array
      onChange([...value, videoUrl]);
      setVideoUrl('');
      toast.success('Video añadido correctamente');
    } catch (error) {
      toast.error('URL de video inválida', {
        description: 'Formatos soportados: mp4, webm, ogg, mov'
      });
    }
  };

  // Reordenar las imágenes
  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= value.length) return;
    
    const newValue = [...value];
    const [movedItem] = newValue.splice(fromIndex, 1);
    newValue.splice(toIndex, 0, movedItem);
    onChange(newValue);
  };

  // Determinar el tipo de medio por la URL
  const getMediaType = (url: string): 'image' | 'video' => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext)) ? 'video' : 'image';
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex justify-between items-center">
        <Label htmlFor={`gallery-uploader-${label}`} className="block font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <span className="text-sm text-neutral-400">
          {value.length}/{maxItems} elementos
        </span>
      </div>

      {/* Tabs para diferentes métodos de agregar medios */}
      <Tabs 
        defaultValue="upload" 
        value={currentTab} 
        onValueChange={setCurrentTab} 
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <ImagePlus className="h-4 w-4" />
            <span>Subir archivos</span>
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            <span>URL externa</span>
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center gap-2">
            <Film className="h-4 w-4" />
            <span>Video</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <div 
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer relative",
              isDragging 
                ? "border-indigo-500 bg-indigo-950/20" 
                : "border-white/10 bg-black/30 hover:bg-black/40 hover:border-white/20",
              uploadError && "border-red-500 bg-red-950/10"
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById(`gallery-uploader-${label}`)?.click()}
          >
            <input 
              id={`gallery-uploader-${label}`}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileInputChange}
              className="sr-only"
            />
            
            <div className="flex flex-col items-center justify-center space-y-2 text-white/80">
              {isUploading ? (
                <>
                  <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
                  <p>Subiendo archivos...</p>
                </>
              ) : uploadError ? (
                <>
                  <div className="text-red-400">
                    <p>{uploadError}</p>
                    <p className="text-sm mt-1">Haz clic para intentar de nuevo</p>
                  </div>
                </>
              ) : (
                <>
                  <Plus className="h-10 w-10 text-indigo-400" />
                  <p>{helpText}</p>
                  <p className="text-xs text-gray-400">
                    Formatos permitidos: JPG, PNG, GIF, WebP, MP4, WebM (Máx. 15MB)<br/>
                    Puedes seleccionar múltiples archivos
                  </p>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="url">
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="external-url">URL de imagen externa</Label>
                <Input
                  id="external-url"
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="mt-1"
                />
              </div>
              <Button 
                type="button" 
                onClick={handleAddExternalUrl} 
                disabled={!externalUrl}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Añadir
              </Button>
            </div>
            
            <div className="text-xs text-neutral-400">
              <p>Introduce la URL completa de una imagen disponible públicamente en internet.</p>
              <p>Nota: Las imágenes externas pueden no estar siempre disponibles si la fuente cambia.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="video">
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="video-url">URL o ruta de video</Label>
                <Input
                  id="video-url"
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="/videos/ejemplo.mp4 o https://ejemplo.com/video.mp4"
                  className="mt-1"
                />
              </div>
              <Button 
                type="button" 
                onClick={handleAddVideoUrl} 
                disabled={!videoUrl}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Añadir
              </Button>
            </div>
            
            <div className="text-xs text-neutral-400">
              <p>Puedes usar tanto URLs externas como rutas relativas para videos locales:</p>
              <ul className="list-disc list-inside mt-1">
                <li>URL externa: https://ejemplo.com/video.mp4</li>
                <li>Ruta local: /videos/ejemplo.mp4 (desde carpeta public)</li>
              </ul>
              <p className="mt-1">Formatos soportados: .mp4, .webm, .ogg, .mov</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Previsualización de la galería */}
      {value.length > 0 && (
        <div className="mt-4 space-y-4">
          <h3 className="text-sm font-medium">Previsualización de la galería ({value.length} elementos)</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {value.map((url, index) => (
              <div 
                key={index} 
                className="relative group aspect-square bg-neutral-900 rounded-md overflow-hidden border border-white/10"
              >
                {getMediaType(url) === 'image' ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={url}
                      alt={`Galería ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-neutral-900">
                    <FileVideo className="h-10 w-10 text-indigo-400" />
                  </div>
                )}
                
                {/* Metadata */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1">
                  {getMediaType(url) === 'image' ? 'Imagen' : 'Video'} {index + 1}
                </div>
                
                {/* Acciones */}
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {/* Navegación */}
                  <div className="flex gap-1">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => moveImage(index, index - 1)} 
                      disabled={index === 0}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      ←
                    </Button>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => moveImage(index, index + 1)} 
                      disabled={index === value.length - 1}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      →
                    </Button>
                  </div>
                  
                  {/* Eliminar */}
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleRemoveImage(index)}
                    className="mt-2"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
