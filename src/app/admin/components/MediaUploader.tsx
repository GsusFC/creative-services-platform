'use client'

import { useState, useRef, useCallback } from 'react';
import { MediaItem } from '@/types/case-study';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Info, 
  Link as LinkIcon, // Renombrar para evitar conflicto
  Video, 
  User,
  Layout,
  GripVertical // Icono para drag handle
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSwappingStrategy // O verticalListSortingStrategy si prefieres lista vertical
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Helper para obtener un ID estable como string
const getStableItemId = (item: MediaItem): string => {
  return item.url || `order-${item.order}`; // Usa URL o 'order-' + número
};

// Interfaz para el componente SortableItem
interface SortableItemProps {
  id: string;
  item: MediaItem;
  index: number; // Índice original antes de filtrar por rol
  handleRemoveMedia: (index: number) => void;
  disabled?: boolean;
}

// Componente para un elemento multimedia arrastrable
function SortableItem({ id, item, index, handleRemoveMedia, disabled }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging, // Estado para saber si se está arrastrando
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined, // Poner encima al arrastrar
    opacity: isDragging ? 0.5 : 1, // Hacer semitransparente al arrastrar
  };

  // Función para mostrar detalles (simplificada)
  const showDetails = () => {
    toast.info(`Tipo: ${item.type}, Rol: ${item.role || 'gallery'}, URL: ${item.url.substring(0, 30)}...`);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="relative group touch-manipulation"> {/* touch-manipulation para mejor UX móvil */}
      {/* Contenedor con aspect ratio */}
      <div className={`relative w-full overflow-hidden bg-gray-800 border border-gray-700 ${item.role === 'hero' ? 'aspect-video' : item.role === 'cover' || item.role === 'avatar' ? 'aspect-square' : 'aspect-video'}`}>
        {item.type === 'image' && item.url ? (
          <Image
            src={item.url} // Asumimos URL local válida
            alt={item.alt || `Media ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={index < 3}
          />
        ) : item.type === 'video' && item.url ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
            <Video className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-xs text-gray-300 break-all">Video</p>
            {/* Mostrar URL del video */}
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-blue-400 hover:underline mt-1 break-all"
              onClick={(e) => e.stopPropagation()} // Evitar que el drag se active al hacer clic en el enlace
            >
              {item.url.substring(0, 30)}...
            </a>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
        )}
      </div>
      
      {/* Botones de acción y Drag Handle */}
      <div className="absolute top-1 right-1 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-1 rounded">
         {/* Drag Handle */}
         <button 
           {...listeners} 
           className="cursor-grab touch-none p-1 text-gray-300 hover:text-white"
           aria-label="Mover item"
           title="Mover"
         >
           <GripVertical className="h-4 w-4" />
         </button>
         <button
           type="button"
           onClick={showDetails}
           className="p-1 text-blue-400 hover:text-blue-300"
           title="Ver detalles"
         >
           <Info className="h-4 w-4" />
         </button>
         {!disabled && (
           <button
             type="button"
             onClick={() => handleRemoveMedia(index)} // Usar el índice original
             className="p-1 text-red-500 hover:text-red-400"
             title="Eliminar"
           >
             <X className="h-4 w-4" />
           </button>
         )}
      </div>
       {/* Mostrar Rol (opcional) */}
       <div className="absolute bottom-1 left-1 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
         {item.role || 'gallery'}
       </div>
    </div>
  );
}


// Props del componente principal
interface MediaUploaderProps {
  mediaItems: MediaItem[];
  onMediaChangeAction: (mediaItems: MediaItem[]) => void;
  disabled?: boolean;
}

export function MediaUploader({ mediaItems = [], onMediaChangeAction, disabled = false }: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [isAddingVideoUrl, setIsAddingVideoUrl] = useState(false);

  // Referencias para inputs de archivo
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  // --- Lógica de subida (simplificada, asume base64 temporal) ---
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, role: MediaItem['role']) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const isSpecialRole = role === 'hero' || role === 'cover' || role === 'avatar';
    const filesToProcess = isSpecialRole ? [files[0]] : Array.from(files);

    try {
      const processedItems: MediaItem[] = [];
      for (const file of filesToProcess) {
        if (!file) continue;
        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');
        if (!isVideo && !isImage) {
          toast.error(`Tipo no soportado: ${file.type}`);
          continue;
        }
        const base64 = await fileToBase64(file);
        processedItems.push({
          type: isImage ? 'image' : 'video',
          url: base64, // Temporalmente base64, se reemplazará al guardar
          alt: file.name,
          width: 800, // Default
          height: 600, // Default
          order: isSpecialRole ? 0 : mediaItems.length + processedItems.length, // Order for special roles is often fixed
          role: role,
          videoType: isVideo ? 'local' : undefined,
        });
      }

      let updatedItems: MediaItem[];
      if (isSpecialRole && processedItems.length > 0) {
        const existingIndex = mediaItems.findIndex(item => item.role === role);
        const newItem = processedItems[0];
        newItem.order = existingIndex >= 0 ? mediaItems[existingIndex].order : 0; // Preserve order if replacing

        if (existingIndex >= 0) {
          updatedItems = [...mediaItems];
          updatedItems[existingIndex] = newItem;
          toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} actualizado.`);
        } else {
          updatedItems = [...mediaItems, newItem];
          toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} añadido.`);
        }
      } else {
        // Add to gallery
        updatedItems = [...mediaItems, ...processedItems];
        if (processedItems.length > 0) toast.success(`${processedItems.length} archivo(s) añadido(s) a la galería.`);
      }

      onMediaChangeAction(updatedItems);

    } catch (error) {
      console.error(`Error al cargar archivo(s) para ${role}:`, error);
      toast.error(`Error al cargar archivo(s) para ${role}`);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = ''; // Clear input
    }
  };

  const handleAddSpecialMedia = (type: 'hero' | 'cover' | 'avatar') => {
    const ref = type === 'hero' ? heroFileInputRef : type === 'cover' ? coverFileInputRef : avatarFileInputRef;
    ref.current?.click();
  };

  const handleAddVideoUrl = () => {
    if (!videoUrl) return toast.error('Introduce una URL de video válida');
    try { new URL(videoUrl); } catch (e) { return toast.error('URL de video no válida'); }

    const isVimeo = videoUrl.includes('vimeo.com');
    const isYoutube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    let videoType: MediaItem['videoType'] = 'other';
    if (isVimeo) videoType = 'vimeo';
    if (isYoutube) videoType = 'youtube';

    const newVideoItem: MediaItem = {
      type: 'video', url: videoUrl, alt: `Video ${videoType}`,
      width: 1920, height: 1080, order: mediaItems.length, role: 'gallery', videoType: videoType,
    };
    onMediaChangeAction([...mediaItems, newVideoItem]);
    setVideoUrl('');
    setIsAddingVideoUrl(false);
    toast.success('URL de video añadida a la galería.');
  };

  const handleRemoveMedia = (indexToRemove: number) => {
    const itemToRemove = mediaItems[indexToRemove];
    const updatedMediaItems = mediaItems.filter((_, index) => index !== indexToRemove)
                                      .map((item, newIndex) => ({ ...item, order: newIndex })); // Reasignar order
    onMediaChangeAction(updatedMediaItems);
    toast.success(`Elemento "${itemToRemove?.alt || 'multimedia'}" eliminado.`);
  };

  // --- Lógica de Drag and Drop ---
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      // Solo reordenamos los items de la galería
      const galleryItems = mediaItems.filter(item => item.role === 'gallery');
      const otherItems = mediaItems.filter(item => item.role !== 'gallery');

      const oldIndexInGallery = galleryItems.findIndex((item) => (item.url || item.order) === active.id);
      const newIndexInGallery = galleryItems.findIndex((item) => (item.url || item.order) === over.id);

      if (oldIndexInGallery !== -1 && newIndexInGallery !== -1) {
        const reorderedGalleryItems = arrayMove(galleryItems, oldIndexInGallery, newIndexInGallery);
        
        // Combinar y reasignar el orden global
        const finalItems = [...otherItems, ...reorderedGalleryItems].map((item, index) => ({
          ...item,
          order: index // Actualizar el orden basado en la posición final
        }));

        onMediaChangeAction(finalItems);
      }
    }
  }, [mediaItems, onMediaChangeAction]);

  // --- Renderizado ---
  const renderSpecialItem = (role: 'hero' | 'cover' | 'avatar') => {
    const item = mediaItems.find(i => i.role === role);
    const index = mediaItems.findIndex(i => i.role === role); // Índice original
    const Icon = role === 'hero' ? Layout : role === 'avatar' ? User : ImageIcon;
    const aspectRatio = role === 'hero' ? '(16:9)' : '(1:1)';

    return (
      <div key={role} className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-300">
            {role.charAt(0).toUpperCase() + role.slice(1)} {aspectRatio}
          </h4>
          <Button type="button" variant="outline" size="sm"
            onClick={() => handleAddSpecialMedia(role)}
            disabled={disabled || isUploading}
            className="text-xs text-gray-300 border border-gray-700 hover:bg-gray-700 h-7 px-2">
            {item ? 'Cambiar' : 'Añadir'}
          </Button>
        </div>
        {item ? (
           // Usamos SortableItem pero sin contexto de ordenación para estos roles
           // Aplicar getStableItemId aquí también
           <SortableItem id={getStableItemId(item)} item={item} index={index} handleRemoveMedia={handleRemoveMedia} disabled={disabled} />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-800 border border-dashed border-gray-700">
            <Icon className="h-12 w-12 text-gray-500 mb-2" />
            <p className="text-gray-400 text-center">No hay imagen {role} aún</p>
          </div>
        )}
      </div>
    );
  };

  // Filtrar items de galería para dnd-kit
  const galleryItems = mediaItems.filter(item => item.role === 'gallery' || !item.role); // Incluir sin rol como galería
  // Crear un array de IDs estables para SortableContext
  const galleryItemIds = galleryItems.map(item => item.url || item.order.toString()); // Usar URL o order como ID

  return (
    <div className="space-y-4">
      {/* Controles Superiores */}
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium text-gray-200">Multimedia ({mediaItems.length})</h3>
        <div className="flex space-x-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setIsAddingVideoUrl(!isAddingVideoUrl)} disabled={disabled} className="text-sm text-gray-300 border border-gray-700 hover:bg-gray-700">
            <LinkIcon className="h-4 w-4 mr-2" /> Añadir URL Video
          </Button>
          {/* Botón genérico para añadir a galería */}
          <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={disabled || isUploading} className="text-sm text-gray-300 border border-gray-700 hover:bg-gray-700">
            <Upload className="h-4 w-4 mr-2" /> {isUploading ? 'Subiendo...' : 'Añadir a Galería'}
          </Button>
        </div>
        {/* Inputs ocultos */}
        <input type="file" ref={fileInputRef} onChange={(e) => handleFileUpload(e, 'gallery')} className="hidden" accept="image/*,video/*" multiple />
        <input type="file" ref={heroFileInputRef} onChange={(e) => handleFileUpload(e, 'hero')} className="hidden" accept="image/*" />
        <input type="file" ref={coverFileInputRef} onChange={(e) => handleFileUpload(e, 'cover')} className="hidden" accept="image/*" />
        <input type="file" ref={avatarFileInputRef} onChange={(e) => handleFileUpload(e, 'avatar')} className="hidden" accept="image/*" />
      </div>

      {/* Añadir URL Video Form */}
      {isAddingVideoUrl && (
        <div className="flex items-center space-x-2">
          <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://vimeo.com/..." className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <Button type="button" onClick={handleAddVideoUrl} disabled={!videoUrl} className="bg-blue-600 hover:bg-blue-700 text-white">Añadir</Button>
          <Button type="button" variant="outline" onClick={() => setIsAddingVideoUrl(false)} className="text-gray-300 border border-gray-700 hover:bg-gray-700">Cancelar</Button>
        </div>
      )}

      {/* Secciones Especiales (Avatar, Hero, Cover) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderSpecialItem('avatar')}
        {renderSpecialItem('hero')}
        {renderSpecialItem('cover')}
      </div>

      {/* Sección Galería (Ordenable) */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Galería (Arrastra para reordenar)</h4>
        {galleryItems.length > 0 ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={galleryItemIds} strategy={rectSwappingStrategy}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryItems.map((item) => {
                   // Encontrar el índice original en el array `mediaItems` para pasarlo a handleRemoveMedia
                   const originalIndex = mediaItems.findIndex(mi => getStableItemId(mi) === getStableItemId(item));
                   const stableId = getStableItemId(item); // Obtener ID estable
                   return (
                     <SortableItem 
                       key={stableId} 
                       id={stableId} 
                       item={item} 
                       index={originalIndex} // Pasar índice original
                       handleRemoveMedia={handleRemoveMedia} 
                       disabled={disabled} 
                     />
                   );
                })}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-800 border border-dashed border-gray-700">
            <ImageIcon className="h-12 w-12 text-gray-500 mb-2" />
            <p className="text-gray-400 text-center">Galería vacía.</p>
          </div>
        )}
      </div>
    </div>
  );
}
