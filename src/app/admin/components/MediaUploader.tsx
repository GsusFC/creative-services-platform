'use client'

import { useState, useRef, useEffect } from 'react'
import { MediaItem } from '@/types/case-study'
import { Button } from '@/components/ui/button'
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  AlertCircle, 
  Info, 
  RefreshCw, 
  Link, 
  Video, 
  FileVideo,
  User,
  Layout
} from 'lucide-react'
import Image from 'next/image'
import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'

interface MediaUploaderProps {
  mediaItems: MediaItem[]
  onMediaChangeAction: (mediaItems: MediaItem[]) => void
  disabled?: boolean
}

type MediaItemWithStatus = MediaItem & { 
  status?: 'loading' | 'error' | 'success' | undefined;
  retryCount?: number;
  isUrl?: boolean; // Para identificar si es una URL externa o un archivo local
  aspectRatio?: '16:9' | '1:1' | 'auto'; // Para identificar la relación de aspecto
}



export function MediaUploader({ mediaItems, onMediaChangeAction, disabled = false }: MediaUploaderProps) {
  // Estados para controlar la carga y visualización
  const [isUploading, setIsUploading] = useState(false)
  const [mediaItemsWithStatus, setMediaItemsWithStatus] = useState<MediaItemWithStatus[]>([])

  const [selectedRole, setSelectedRole] = useState<MediaItem['role']>('gallery')
  const [videoUrl, setVideoUrl] = useState('')
  const [isAddingVideoUrl, setIsAddingVideoUrl] = useState(false)
  
  // Referencias para los inputs de archivos
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoUrlRef = useRef<HTMLInputElement>(null)
  const heroFileInputRef = useRef<HTMLInputElement>(null)
  const coverFileInputRef = useRef<HTMLInputElement>(null)
  const avatarFileInputRef = useRef<HTMLInputElement>(null)

  // Actualizar el estado de los mediaItems cuando cambian desde props
  useEffect(() => {
    console.log('MediaUploader: Actualizando mediaItems', mediaItems.length);
    
    // Mapear los mediaItems para añadir estado de carga y determinar si son URLs
    const itemsWithStatus = mediaItems.map(item => {
      // Determinar si es una URL externa
      const isUrlValue = Boolean(item.url && !item.url.startsWith('data:') && (
        item.url.startsWith('http://') || 
        item.url.startsWith('https://') || 
        item.url.startsWith('www.')
      ));
      
      // Determinar la relación de aspecto según el rol
      let aspectRatioValue: '16:9' | '1:1' | 'auto';
      
      if (item.role === 'cover' || item.role === 'avatar') {
        aspectRatioValue = '1:1';
      } else if (item.role === 'hero' || item.role === 'gallery') {
        aspectRatioValue = '16:9';
      } else {
        aspectRatioValue = 'auto';
      }
      
      return {
        ...item,
        status: undefined as ('loading' | 'error' | 'success' | undefined),
        retryCount: 0,
        isUrl: isUrlValue,
        aspectRatio: aspectRatioValue
      };
    });
    
    setMediaItemsWithStatus(itemsWithStatus);
  }, [mediaItems]);

  // Función para manejar la subida de archivos Hero
  const handleHeroFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleSpecialFileUpload(e, 'hero');
  };
  
  // Función para manejar la subida de archivos Cover
  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleSpecialFileUpload(e, 'cover');
  };
  
  // Función para manejar la subida de archivos Avatar
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleSpecialFileUpload(e, 'avatar');
  };
  
  // Función para manejar la subida de archivos especiales (hero, cover, avatar)
  const handleSpecialFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, role: 'hero' | 'cover' | 'avatar') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Solo procesar el primer archivo para roles especiales
    const file = files[0];
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      // Verificar que sea una imagen
      if (!file.type.startsWith('image/')) {
        toast.error(`Solo se permiten imágenes para ${role}`);
        return;
      }
      
      // Convertir a base64
      const base64 = await fileToBase64(file);
      
      // Buscar si ya existe un item con este rol
      const existingIndex = mediaItemsWithStatus.findIndex(item => item.role === role);
      
      // Crear el nuevo item
      const newItem: MediaItem = {
        type: 'image',
        url: base64 as string,
        alt: `${role} - ${file.name}`,
        width: role === 'cover' || role === 'avatar' ? 800 : 1920, // Valores por defecto
        height: role === 'cover' || role === 'avatar' ? 800 : 1080,
        order: existingIndex >= 0 && mediaItemsWithStatus[existingIndex]?.order ? mediaItemsWithStatus[existingIndex].order : 0,
        role: role
      };
      
      // Actualizar la lista de medios
      let updatedItems: MediaItem[];
      
      if (existingIndex >= 0) {
        // Reemplazar el item existente
        updatedItems = [...mediaItems];
        updatedItems[existingIndex] = newItem;
        toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} actualizado correctamente`);
      } else {
        // Añadir nuevo item
        updatedItems = [...mediaItems, newItem];
        toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} añadido correctamente`);
      }
      
      onMediaChangeAction(updatedItems);
    } catch (error) {
      console.error(`Error al cargar archivo ${role}:`, error);
      toast.error(`Error al cargar archivo ${role}`);
    } finally {
      setIsUploading(false);
      // Limpiar input
      if (e.target) {
        e.target.value = '';
      }
    }
  };
  
  // Función para abrir el selector de archivos según el tipo
  const handleAddSpecialMedia = (type: 'hero' | 'cover' | 'avatar') => {
    switch (type) {
      case 'hero':
        heroFileInputRef.current?.click();
        break;
      case 'cover':
        coverFileInputRef.current?.click();
        break;
      case 'avatar':
        avatarFileInputRef.current?.click();
        break;
    }
  };
  
  // Función para manejar la subida de archivos de galería
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    
    try {
      const newMediaItems: MediaItem[] = []
      
      // Procesar cada archivo
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (!file) continue
        
        // Determinar el tipo de archivo
        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');
        
        if (!isVideo && !isImage) {
          toast.error(`Tipo de archivo no soportado: ${file.type}`);
          continue;
        }
        
        // Convertir a base64 para almacenamiento local
        const base64 = await fileToBase64(file)
        
        // Crear objeto MediaItem
        const mediaItem: MediaItem = {
          type: file.type.startsWith('image/') ? 'image' : 'video',
          url: base64,
          alt: file.name,
          width: 800, // Valores por defecto
          height: 600,
          order: mediaItems.length + i,
          role: selectedRole || 'gallery' // Asegurarse de que role nunca sea undefined
        }
        
        newMediaItems.push(mediaItem)
      }
      
      // Actualizar lista de medios
      onMediaChangeAction([...mediaItems, ...newMediaItems])
      toast.success('Archivos multimedia añadidos correctamente')
    } catch (error) {
      console.error('Error al cargar archivos:', error)
      toast.error('Error al cargar archivos multimedia')
    } finally {
      setIsUploading(false)
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Función para renderizar un elemento multimedia
  const renderMediaItem = (item: MediaItemWithStatus, index: number) => {
    return (
      <div key={`${item.role}-${index}`} className="relative group aspect-video bg-gray-800 rounded-md overflow-hidden border border-gray-700">
        {item.type === 'image' ? (
          <div className="w-full h-full relative">
            {item.status === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900/70">
                <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
              </div>
            )}
            
            {item.status === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gray-900/90">
                <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-xs text-red-300 mb-2">Error al cargar imagen</p>
                <button 
                  onClick={() => handleRetryImage(index)}
                  className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-white flex items-center"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reintentar
                </button>
              </div>
            )}
            
            {/* Intentar mostrar la imagen */}
            {item.url && (
              <div className="relative w-full h-full">
                {isBase64(item.url) ? (
                  <img
                    src={item.url}
                    alt={item.alt || `Imagen ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={() => handleImageError(index, item.url)}
                    onLoad={() => handleImageLoad(index)}
                  />
                ) : (
                  <Image
                    src={item.url}
                    alt={item.alt || `Imagen ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized={true}
                    onError={() => handleImageError(index, item.url)}
                    onLoad={() => handleImageLoad(index)}
                    priority={index < 3} // Priorizar las primeras imágenes
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
              </div>
            )}
            
            {/* Mostrar información sobre el tipo de imagen */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-xs text-gray-300 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isBase64(item.url) ? 'Base64' : 'URL'} | {item.alt?.substring(0, 15) || 'Sin nombre'}
              {item.status === 'success' && <span className="ml-1 text-green-400">✓</span>}
            </div>
          </div>
        ) : item.type === 'video' ? (
          <div className="w-full h-full flex items-center justify-center">
            <video 
              src={item.url} 
              controls 
              className="w-full h-full object-cover"
              onError={() => handleImageError(index, item.url)}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}
        
        {/* Botones de acción */}
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            type="button"
            onClick={() => showImageDetails(item)}
            className="p-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Ver detalles"
          >
            <Info className="h-4 w-4 text-white" />
          </button>
          
          {item.status === 'error' && (
            <button
              type="button"
              onClick={() => handleRetryImage(index)}
              className="p-1 bg-yellow-500 rounded-full opacity-100 transition-opacity"
              title="Reintentar carga"
            >
              <RefreshCw className="h-4 w-4 text-white" />
            </button>
          )}
          
          {!disabled && (
            <button
              type="button"
              onClick={() => handleRemoveMedia(index)}
              className="p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              title="Eliminar"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const handleRemoveMedia = (index: number) => {
    const updatedMediaItems = [...mediaItems];
    const removedItem = updatedMediaItems[index];
    
    // Mensaje personalizado según el tipo de elemento
    const itemType = removedItem?.role || 'elemento';
    const itemName = itemType.charAt(0).toUpperCase() + itemType.slice(1);
    
    updatedMediaItems.splice(index, 1);
    onMediaChangeAction(updatedMediaItems);
    
    toast.success(`${itemName} eliminado correctamente`);
  }

  const handleAddMediaClick = () => {
    setSelectedRole('gallery'); // Por defecto, añadir a la galería
    fileInputRef.current?.click();
  }

  // Función para convertir archivo a base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const result = reader.result as string
        console.log('Base64 generado:', result.substring(0, 50) + '...')
        resolve(result)
      }
      reader.onerror = error => {
        console.error('Error al convertir a base64:', error)
        reject(error)
      }
    })
  }

  // Función para verificar si una URL es base64
  const isBase64 = (str: string): boolean => {
    try {
      return str.startsWith('data:image/')
    } catch (e) {
      console.error('Error al verificar base64:', e)
      return false
    }
  }

  // Función para manejar errores de carga de imagen
  const handleImageError = (index: number, url: string) => {
    console.error(`Error al cargar imagen ${index}:`, url.substring(0, 50) + '...');
    
    // Actualizar el estado del item
    const updatedItems = [...mediaItemsWithStatus];
    if (updatedItems[index]) {
      if (updatedItems[index]) {
        updatedItems[index].status = 'error';
      }
      if (updatedItems[index]) {
        updatedItems[index].retryCount = (updatedItems[index]?.retryCount || 0) + 1;
      }
      setMediaItemsWithStatus(updatedItems);
      
      // Intentar reintentar automáticamente la primera vez
      if (updatedItems[index].retryCount === 1) {
        console.log(`Reintento automático para imagen ${index}`);
        setTimeout(() => handleRetryImage(index), 1000);
        
        // Notificar al usuario
        toast.error(`Error al cargar imagen: ${updatedItems[index].alt || `Imagen ${index + 1}`}`, {
          description: 'Reintentando cargar automáticamente...'
        });
      } else if (updatedItems[index].retryCount === 2) {
        // Si falla por segunda vez, mostrar un mensaje más detallado
        toast.error(`Persistente error de carga: ${updatedItems[index].alt || `Imagen ${index + 1}`}`, {
          description: 'La imagen no se pudo cargar después de reintentar. Puede intentar manualmente.'
        });
        
        // Registrar información detallada para depuración
        console.log('Detalles de la imagen con error:', {
          index,
          type: updatedItems[index].type,
          alt: updatedItems[index].alt,
          isBase64: isBase64(url),
          urlLength: url.length,
          urlStart: url.substring(0, 50)
        });
      }
    }
  }

  // Función para manejar carga exitosa de imagen
  const handleImageLoad = (index: number) => {
    const updatedItems = [...mediaItemsWithStatus];
    if (updatedItems[index]) {
      // Solo actualizar si el estado anterior era undefined o error
      if (updatedItems[index].status !== 'success') {
        updatedItems[index].status = 'success';
        setMediaItemsWithStatus(updatedItems);
        
        // Si anteriormente había fallado, notificar que se ha recuperado
        if (updatedItems[index].retryCount && updatedItems[index].retryCount > 0) {
          toast.success(`Imagen recuperada: ${updatedItems[index].alt || `Imagen ${index + 1}`}`);
        }
      }
    }
  }
  
  // Función para reintentar cargar una imagen
  const handleRetryImage = (index: number) => {
    console.log(`Reintentando cargar imagen ${index}`);
    const updatedItems = [...mediaItemsWithStatus];
    if (updatedItems[index]) {
      // Forzar recarga cambiando temporalmente la URL
      const originalUrl = updatedItems[index].url;
      updatedItems[index].status = 'loading';
      if (updatedItems[index]) {
        updatedItems[index].retryCount = (updatedItems[index]?.retryCount || 0) + 1;
      }
      setMediaItemsWithStatus(updatedItems);
      
      // Usar un enfoque diferente para forzar la recarga
      setTimeout(() => {
        // Crear una copia fresca del array para asegurar que React detecta el cambio
        const refreshedItems = JSON.parse(JSON.stringify(mediaItemsWithStatus));
        if (refreshedItems[index]) {
          // Añadir un timestamp para forzar la recarga
          const hasQueryParam = originalUrl.includes('?');
          const separator = hasQueryParam ? '&' : '?';
          const timestampedUrl = isBase64(originalUrl) 
            ? originalUrl 
            : `${originalUrl}${separator}t=${Date.now()}`;
          
          refreshedItems[index].url = timestampedUrl;
          refreshedItems[index].status = undefined; // Reiniciar el estado
          console.log(`URL actualizada con timestamp: ${timestampedUrl.substring(0, 50)}...`);
          setMediaItemsWithStatus(refreshedItems);
        }
      }, 500); // Dar más tiempo para que el DOM se actualice
    }
  }

  // Función para mostrar detalles de la imagen
  const showImageDetails = (item: MediaItem) => {
    console.log('Detalles de imagen:', {
      type: item.type,
      url: item.url.substring(0, 50) + '...',
      alt: item.alt,
      width: item.width,
      height: item.height,
      isBase64: isBase64(item.url)
    });
    
    toast.info(`Tipo: ${item.type}, Alt: ${item.alt || 'No disponible'}`);
  }

  // Obtener elementos por rol
  const getItemsByRole = (role: MediaItem['role']) => {
    return mediaItemsWithStatus.filter(item => item.role === role);
  };
  
  // Manejar la adición de URL de video
  const handleAddVideoUrl = () => {
    if (!videoUrl) {
      toast.error('Por favor, introduce una URL de video válida');
      return;
    }
    
    // Validar que sea una URL válida
    try {
      new URL(videoUrl);
    } catch (e) {
      toast.error('URL de video no válida');
      return;
    }
    
    // Determinar si es una URL de Vimeo
    const isVimeo = videoUrl.includes('vimeo.com');
    
    // Crear nuevo item de video
    const newVideoItem: MediaItem = {
      type: 'video',
      url: videoUrl,
      alt: `Video ${isVimeo ? 'Vimeo' : 'externo'}`,
      width: 1920,
      height: 1080,
      order: mediaItems.length,
      role: selectedRole || 'gallery', // Asegurarse de que role nunca sea undefined
      videoType: isVimeo ? 'vimeo' : 'local'
    };
    
    // Actualizar lista de medios
    const updatedItems = [...mediaItems, newVideoItem];
    onMediaChangeAction(updatedItems);
    
    // Limpiar campo
    setVideoUrl('');
    setIsAddingVideoUrl(false);
    toast.success('URL de video añadida correctamente');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium text-gray-200">
          Multimedia ({mediaItems.length})
        </h3>
        <div className="flex space-x-2">
          <Button 
            type="button"
            variant="outline" 
            size="sm"
            onClick={() => setIsAddingVideoUrl(!isAddingVideoUrl)}
            disabled={disabled}
            className="text-sm text-gray-300 border border-gray-700 hover:bg-gray-700"
          >
            <Link className="h-4 w-4 mr-2" />
            Añadir URL de Video
          </Button>
          <Button 
            type="button"
            variant="outline" 
            size="sm"
            onClick={handleAddMediaClick}
            disabled={disabled || isUploading}
            className="text-sm text-gray-300 border border-gray-700 hover:bg-gray-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Subiendo...' : 'Añadir Archivos'}
          </Button>
        </div>
        
        {/* Inputs ocultos para cada tipo de archivo */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*,video/*" 
          multiple 
        />
        <input 
          type="file" 
          ref={heroFileInputRef} 
          onChange={handleHeroFileChange} 
          className="hidden" 
          accept="image/*" 
        />
        <input 
          type="file" 
          ref={coverFileInputRef} 
          onChange={handleCoverFileChange} 
          className="hidden" 
          accept="image/*" 
        />
        <input 
          type="file" 
          ref={avatarFileInputRef} 
          onChange={handleAvatarFileChange} 
          className="hidden" 
          accept="image/*" 
        />
      </div>
      
      {/* Campo para añadir URL de video */}
      {isAddingVideoUrl && (
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://vimeo.com/123456789"
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            type="button"
            onClick={handleAddVideoUrl}
            disabled={!videoUrl}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Añadir
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAddingVideoUrl(false)}
            className="text-gray-300 border border-gray-700 hover:bg-gray-700"
          >
            Cancelar
          </Button>
        </div>
      )}

      <div className="space-y-6">
          {/* Secciones de Medios */}
          {['avatar', 'hero', 'cover'].map(role => {
            const hasItem = mediaItemsWithStatus.some(item => item.role === role);
            const aspectRatio = role === 'hero' ? '(16:9)' : role === 'avatar' || role === 'cover' ? '(1:1)' : '';
            const icon = role === 'hero' ? Layout : role === 'avatar' ? User : ImageIcon;
            const Icon = icon;
            
            return (
              <div key={role} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-300">
                    {role.charAt(0).toUpperCase() + role.slice(1)} {aspectRatio}
                  </h4>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="sm"
                    onClick={() => handleAddSpecialMedia(role as 'hero' | 'cover' | 'avatar')}
                    disabled={disabled || isUploading}
                    className="text-xs text-gray-300 border border-gray-700 hover:bg-gray-700 h-7 px-2"
                  >
                    {hasItem ? 'Cambiar' : 'Añadir'}
                  </Button>
                </div>
                {hasItem ? (
                  <div className={`grid ${role === 'hero' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-4'} gap-4`}>
                    {mediaItemsWithStatus
                      .filter(item => item.role === role)
                      .map((item, index) => renderMediaItem(item, index))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-md border border-dashed border-gray-700">
                    <Icon className="h-12 w-12 text-gray-500 mb-2" />
                    <p className="text-gray-400 text-center">No hay imagen {role} aún</p>
                    <p className="text-gray-500 text-sm text-center mt-1">Haz clic en &quot;Añadir&quot; para subir una imagen {role} {aspectRatio}</p>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Sección Galería */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-300">Galería</h4>
              <div className="flex space-x-2">
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedRole('gallery');
                    handleAddMediaClick();
                  }}
                  disabled={disabled || isUploading}
                  className="text-xs text-gray-300 border border-gray-700 hover:bg-gray-700 h-7 px-2"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Añadir Imagen
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAddingVideoUrl(true)}
                  disabled={disabled || isUploading}
                  className="text-xs text-gray-300 border border-gray-700 hover:bg-gray-700 h-7 px-2"
                >
                  <Link className="h-4 w-4 mr-1" />
                  Añadir Video
                </Button>
              </div>
            </div>
            {mediaItemsWithStatus.filter(item => item.role === 'gallery').length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mediaItemsWithStatus
                  .filter(item => item.role === 'gallery')
                  .map((item, index) => renderMediaItem(item, index))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-gray-800 rounded-md border border-dashed border-gray-700">
                <ImageIcon className="h-12 w-12 text-gray-500 mb-2" />
                <p className="text-gray-400 text-center">No hay contenido en la galería aún</p>
                <p className="text-gray-500 text-sm text-center mt-1">Añade imágenes o videos a la galería usando los botones de arriba</p>
              </div>
            )}
          </div>

      </div>
    </div>
  )
}
