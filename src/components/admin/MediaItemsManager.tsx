'use client'

import React, { useState } from 'react';
import { MediaItem } from '@/types/case-study';
import { PlusCircleIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface MediaItemsManagerProps {
  mediaItems: MediaItem[];
  onChange: (items: MediaItem[]) => void;
}

const MediaItemsManager: React.FC<MediaItemsManagerProps> = ({
  mediaItems,
  onChange
}) => {
  const [newItem, setNewItem] = useState<Partial<MediaItem>>({
    type: 'image',
    url: '',
    alt: '',
    width: 1920,
    height: 1080,
    order: mediaItems.length,
    displayMode: 'single'
  });

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    if (name === 'width' || name === 'height' || name === 'order') {
      parsedValue = parseInt(value, 10) || 0;
    }
    
    setNewItem(prev => ({ ...prev, [name]: parsedValue }));
  };

  const addMediaItem = () => {
    if (!newItem.url) {
      alert('La URL es obligatoria');
      return;
    }
    
    if (!newItem.alt) {
      alert('El texto alternativo es obligatorio');
      return;
    }

    const newMediaItem: MediaItem = {
      type: newItem.type as 'image' | 'video',
      url: newItem.url as string,
      videoType: newItem.type === 'video' ? (newItem.videoType as 'vimeo' | 'local' || 'vimeo') : undefined,
      thumbnailUrl: newItem.thumbnailUrl,
      alt: newItem.alt as string,
      width: newItem.width || 1920,
      height: newItem.height || 1080,
      order: newItem.order || mediaItems.length,
      displayMode: newItem.displayMode as 'single' | 'dual' | 'dual_left' | 'dual_right' || 'single'
    };
    
    const updatedItems: MediaItem[] = [...mediaItems, newMediaItem].sort((a, b) => a.order - b.order);
    onChange(updatedItems);
    
    setNewItem({
      type: 'image',
      url: '',
      alt: '',
      width: 1920,
      height: 1080,
      order: updatedItems.length,
      displayMode: 'single'
    });
  };

  const removeMediaItem = (index: number) => {
    const updatedItems: MediaItem[] = mediaItems.filter((_, i) => i !== index);
    // Actualizar el orden de los elementos
    const reorderedItems: MediaItem[] = updatedItems.map((item, i) => ({
      ...item,
      order: i
    }));
    onChange(reorderedItems);
  };

  const moveItemUp = (index: number) => {
    if (index === 0) return;
    
    const updatedItems: MediaItem[] = [...mediaItems];
    const temp = updatedItems[index - 1].order;
    updatedItems[index - 1].order = updatedItems[index].order;
    updatedItems[index].order = temp;
    
    onChange(updatedItems.sort((a, b) => a.order - b.order));
  };

  const moveItemDown = (index: number) => {
    if (index === mediaItems.length - 1) return;
    
    const updatedItems: MediaItem[] = [...mediaItems];
    const temp = updatedItems[index + 1].order;
    updatedItems[index + 1].order = updatedItems[index].order;
    updatedItems[index].order = temp;
    
    onChange(updatedItems.sort((a, b) => a.order - b.order));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-white">Elementos Multimedia</h3>
      
      {/* Lista de elementos multimedia existentes */}
      {mediaItems.length > 0 ? (
        <div className="space-y-4">
          {mediaItems.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row items-start gap-4 p-4 bg-black/50 rounded-md border border-gray-800">
              <div className="w-full md:w-1/4 aspect-video bg-gray-900 flex items-center justify-center rounded">
                {item.type === 'image' ? (
                  <img 
                    src={item.url} 
                    alt={item.alt} 
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-gray-400">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    <p className="text-xs text-gray-400">{item.videoType === 'vimeo' ? 'Vimeo' : 'Video Local'}</p>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-300">URL</p>
                    <p className="text-xs text-gray-500 truncate">{item.url}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-300">Texto Alt</p>
                    <p className="text-xs text-gray-500">{item.alt}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Tipo</p>
                    <p className="text-xs text-gray-500">{item.type === 'image' ? 'Imagen' : 'Video'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-300">Dimensiones</p>
                    <p className="text-xs text-gray-500">{item.width} x {item.height}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-300">Orden</p>
                    <p className="text-xs text-gray-500">{item.order}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-300">Modo de visualización</p>
                    <p className="text-xs text-gray-500">
                      {item.displayMode === 'single' 
                        ? 'Individual' 
                        : item.displayMode === 'dual' 
                          ? 'Par' 
                          : item.displayMode === 'dual_left' 
                            ? 'Par (izquierda)'
                            : 'Par (derecha)'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                <button
                  type="button"
                  onClick={() => moveItemUp(index)}
                  disabled={index === 0}
                  className="p-1 text-blue-400 hover:text-blue-300 disabled:text-gray-600"
                >
                  <ArrowUpIcon className="h-5 w-5" />
                </button>
                
                <button
                  type="button"
                  onClick={() => moveItemDown(index)}
                  disabled={index === mediaItems.length - 1}
                  className="p-1 text-blue-400 hover:text-blue-300 disabled:text-gray-600"
                >
                  <ArrowDownIcon className="h-5 w-5" />
                </button>
                
                <button
                  type="button"
                  onClick={() => removeMediaItem(index)}
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-black/50 p-6 rounded-md border border-gray-800 text-center">
          <p className="text-gray-400 mb-2">No hay elementos multimedia</p>
          <p className="text-sm text-gray-500">Agrega imágenes o videos usando el formulario de abajo</p>
        </div>
      )}
      
      {/* Formulario para agregar nuevo elemento */}
      <div className="bg-black/50 p-6 rounded-md border border-gray-800">
        <h4 className="text-md font-medium mb-4 text-white">Agregar nuevo elemento</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tipo *
            </label>
            <select
              name="type"
              value={newItem.type}
              onChange={handleNewItemChange}
              className="w-full p-2 border border-gray-700 rounded-md bg-black/50 text-white"
            >
              <option value="image">Imagen</option>
              <option value="video">Video</option>
            </select>
          </div>
          
          {newItem.type === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tipo de Video
              </label>
              <select
                name="videoType"
                value={newItem.videoType}
                onChange={handleNewItemChange}
                className="w-full p-2 border border-gray-700 rounded-md bg-black/50 text-white"
              >
                <option value="vimeo">Vimeo</option>
                <option value="local">Video Local</option>
              </select>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              URL *
            </label>
            <input
              type="text"
              name="url"
              value={newItem.url}
              onChange={handleNewItemChange}
              placeholder={newItem.type === 'image' ? "https://example.com/imagen.jpg" : "https://player.vimeo.com/video/123456789"}
              className="w-full p-2 border border-gray-700 rounded-md bg-black/50 text-white"
            />
          </div>
          
          {newItem.type === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                URL Miniatura (opcional)
              </label>
              <input
                type="text"
                name="thumbnailUrl"
                value={newItem.thumbnailUrl || ''}
                onChange={handleNewItemChange}
                placeholder="https://example.com/thumbnail.jpg"
                className="w-full p-2 border border-gray-700 rounded-md bg-black/50 text-white"
              />
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Texto Alternativo *
          </label>
          <input
            type="text"
            name="alt"
            value={newItem.alt}
            onChange={handleNewItemChange}
            placeholder="Descripción de la imagen para accesibilidad"
            className="w-full p-2 border border-gray-700 rounded-md bg-black/50 text-white"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Ancho (px)
            </label>
            <input
              type="number"
              name="width"
              value={newItem.width}
              onChange={handleNewItemChange}
              className="w-full p-2 border border-gray-700 rounded-md bg-black/50 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Alto (px)
            </label>
            <input
              type="number"
              name="height"
              value={newItem.height}
              onChange={handleNewItemChange}
              className="w-full p-2 border border-gray-700 rounded-md bg-black/50 text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Orden
            </label>
            <input
              type="number"
              name="order"
              value={newItem.order}
              onChange={handleNewItemChange}
              className="w-full p-2 border border-gray-700 rounded-md bg-black/50 text-white"
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Modo de visualización
          </label>
          <select
            name="displayMode"
            value={newItem.displayMode}
            onChange={handleNewItemChange}
            className="w-full p-2 border border-gray-700 rounded-md bg-black/50 text-white"
          >
            <option value="single">Individual (100% de ancho)</option>
            <option value="dual">Par (lado a lado)</option>
            <option value="dual_left">Par - Izquierda</option>
            <option value="dual_right">Par - Derecha</option>
          </select>
        </div>
        
        <button
          type="button"
          onClick={addMediaItem}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <PlusCircleIcon className="h-4 w-4 mr-2" />
          Agregar Elemento
        </button>
      </div>
    </div>
  );
};

export default MediaItemsManager;
