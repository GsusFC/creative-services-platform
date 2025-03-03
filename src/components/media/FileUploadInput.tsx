'use client';

import React, { useState, useRef } from 'react';
import { 
  Upload,
  ImagePlus,
  Film,
  AlertCircle,
  Loader2,
  Check,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MediaInput } from '@/components/media/MediaInput';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface FileUploadInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  slug?: string;
  className?: string;
  helpText?: string;
  acceptedFileTypes?: string;
}

export const FileUploadInput = ({
  label,
  value,
  onChange,
  required = false,
  slug = '',
  className,
  helpText = 'Arrastra una imagen o haz clic para seleccionar',
  acceptedFileTypes = 'image/*'
}: FileUploadInputProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Manejadores de eventos drag & drop
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
      const file = e.dataTransfer.files[0];
      await handleFileUpload(file);
    }
  };

  // Manejador para cuando se selecciona un archivo usando el diálogo
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await handleFileUpload(file);
      // Limpiar el input para permitir subir el mismo archivo nuevamente
      e.target.value = '';
    }
  };

  // Función para subir el archivo
  const handleFileUpload = async (file: File) => {
    try {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setUploadError('Solo se permiten archivos de imagen');
        toast.error('Tipo de archivo no permitido', {
          description: 'Solo se permiten archivos de imagen'
        });
        return;
      }

      // Validar tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('El archivo es demasiado grande (máximo 5MB)');
        toast.error('Archivo muy grande', {
          description: 'El tamaño máximo permitido es 5MB'
        });
        return;
      }

      setIsUploading(true);
      setUploadError(null);

      // Crear el formData para enviar el archivo
      const formData = new FormData();
      formData.append('file', file);
      
      // Si hay un slug, lo incluimos (para casos de estudio existentes)
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

      // Actualizar el valor con la URL del archivo subido
      onChange(data.fileUrl);
      toast.success('Archivo subido correctamente');

    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setUploadError(error instanceof Error ? error.message : 'Error desconocido');
      toast.error('Error al subir el archivo', {
        description: error instanceof Error ? error.message : 'Error desconocido'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Manejar clic en el área de drop para abrir el selector de archivos
  const handleAreaClick = () => {
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Limpiar el valor
  const handleClear = () => {
    onChange('');
    setUploadError(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <Label htmlFor={`file-upload-${label}`} className="block font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      </div>

      {/* Si ya hay un valor (URL), mostramos el visor de MediaInput */}
      {value ? (
        <div className="space-y-2">
          <MediaInput 
            label={`Previsualización de ${label}`}
            value={value}
            onChange={onChange}
          />
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="border-white/10 hover:bg-red-950/20 hover:text-red-400"
            >
              <X className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
            <Button
              type="button" 
              onClick={handleAreaClick}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <ImagePlus className="h-4 w-4 mr-1" />
              Cambiar imagen
            </Button>
          </div>
        </div>
      ) : (
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
          onClick={handleAreaClick}
        >
          <input 
            ref={fileInputRef}
            type="file"
            id={`file-upload-${label}`}
            accept={acceptedFileTypes}
            onChange={handleFileInputChange}
            className="sr-only"
          />
          
          <div className="flex flex-col items-center justify-center space-y-2 text-white/80">
            {isUploading ? (
              <>
                <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
                <p>Subiendo archivo...</p>
              </>
            ) : uploadError ? (
              <>
                <AlertCircle className="h-10 w-10 text-red-400" />
                <p className="text-red-400">{uploadError}</p>
                <p className="text-sm text-red-300/70">Haz clic para intentar de nuevo</p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-indigo-400" />
                <p>{helpText}</p>
                <p className="text-xs text-gray-400">
                  Formatos permitidos: JPG, PNG, GIF, WebP (Máx. 5MB)
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
