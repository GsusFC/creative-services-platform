'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, LayoutGrid, Maximize, Columns } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { MediaInput } from './media-input';
import { 
  MediaSection, 
  MediaLayoutType, 
  MediaItem 
} from '@/lib/case-studies/media-types';

interface MediaSectionInputProps {
  value?: Partial<MediaSection>;
  onChange: (value: Partial<MediaSection>) => void;
  allowTitle?: boolean;
  allowDescription?: boolean;
  className?: string;
}

export function MediaSectionInput({
  value,
  onChange,
  allowTitle = true,
  allowDescription = true,
  className = '',
}: MediaSectionInputProps) {
  // Estado local para los elementos multimedia
  const [items, setItems] = useState<MediaItem[]>(
    (value?.items as MediaItem[]) || []
  );
  const [layout, setLayout] = useState<MediaLayoutType>(value?.layout || 'single');
  const [title, setTitle] = useState<string>(value?.title || '');
  const [description, setDescription] = useState<string>(value?.description || '');

  // Determinar cuántos elementos se necesitan según el layout
  const getRequiredItemsCount = (): number => {
    switch (layout) {
      case 'single':
        return 1;
      case 'double':
        return 2;
      case 'grid':
        return 4; // Por defecto, un grid de 2x2
      default:
        return 1;
    }
  };

  // Asegurarse de que haya suficientes elementos para el layout seleccionado
  useEffect(() => {
    const requiredCount = getRequiredItemsCount();
    const currentCount = items.length;
    
    if (currentCount < requiredCount) {
  // Añadir elementos nuevos con valores por defecto si faltan
  const newItems = [...items];
  for (let i = currentCount; i < requiredCount; i++) {
    newItems.push({
      id: `temp-${Date.now()}-${i}`,
      type: 'file',
      source: ''
    });
  }
      setItems(newItems);
    }
    
    // Notificar al componente padre
    onChange({
      layout,
      items,
      title,
      description
    });
  }, [layout, items, title, description]);

  // Manejar cambio de layout
  const handleLayoutChange = (newLayout: MediaLayoutType) => {
    setLayout(newLayout);
  };

  // Manejar cambio en un elemento multimedia
  const handleItemChange = (index: number, itemData: Partial<MediaItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...itemData };
    setItems(newItems);
  };

  // Manejar eliminación de un elemento multimedia
  const handleItemRemove = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // Añadir un nuevo elemento multimedia
  const handleAddItem = () => {
    setItems([...items, {
      id: `temp-${Date.now()}`,
      type: 'file',
      source: ''
    }]);
  };

  // Manejar cambio de título
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // Manejar cambio de descripción
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Selector de layout */}
      <div className="space-y-2">
        <Label>Tipo de presentación</Label>
        <RadioGroup 
          value={layout} 
          onValueChange={(v: string) => handleLayoutChange(v as MediaLayoutType)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="single" id="layout-single" />
            <Label htmlFor="layout-single" className="flex items-center gap-2 cursor-pointer">
              <Maximize className="h-4 w-4" />
              Imagen única
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="double" id="layout-double" />
            <Label htmlFor="layout-double" className="flex items-center gap-2 cursor-pointer">
              <Columns className="h-4 w-4" />
              Dos imágenes
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="grid" id="layout-grid" />
            <Label htmlFor="layout-grid" className="flex items-center gap-2 cursor-pointer">
              <LayoutGrid className="h-4 w-4" />
              Grid
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Campos de título y descripción */}
      {(allowTitle || allowDescription) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allowTitle && (
            <div>
              <Label htmlFor="media-title">Título</Label>
              <Input
                id="media-title"
                type="text"
                placeholder="Título de la sección"
                value={title}
                onChange={handleTitleChange}
                className="mt-1"
              />
            </div>
          )}
          {allowDescription && (
            <div>
              <Label htmlFor="media-description">Descripción</Label>
              <Input
                id="media-description"
                type="text"
                placeholder="Descripción breve"
                value={description}
                onChange={handleDescriptionChange}
                className="mt-1"
              />
            </div>
          )}
        </div>
      )}
      
      {/* Contenedor de elementos multimedia según el layout */}
      <div className={`grid gap-4 ${
        layout === 'single' ? 'grid-cols-1' : 
        layout === 'double' ? 'grid-cols-1 md:grid-cols-2' : 
        'grid-cols-1 md:grid-cols-2'
      }`}>
        {items.map((item, index) => (
          <MediaInput
            key={index}
            value={item as MediaItem}
            onChange={(data) => handleItemChange(index, data)}
            onRemove={items.length > getRequiredItemsCount() ? () => handleItemRemove(index) : undefined}
            label={`Imagen ${index + 1}`}
            className="border border-gray-200 dark:border-gray-800 rounded-md p-4"
          />
        ))}
        
        {/* Botón para añadir más imágenes (solo en grid) */}
        {layout === 'grid' && (
          <Button
            type="button"
            variant="outline"
            onClick={handleAddItem}
            className="h-24 border-dashed flex flex-col items-center justify-center gap-2"
          >
            <Plus className="h-6 w-6" />
            <span>Añadir imagen</span>
          </Button>
        )}
      </div>
      
      {/* Previsualización del layout */}
      <div className="mt-6 border border-gray-200 dark:border-gray-800 rounded-md p-4">
        <h3 className="text-sm font-medium mb-2">Vista previa</h3>
        <div className="w-full">
          <div className={`grid gap-2 ${
            layout === 'single' ? 'grid-cols-1 w-full' : 
            layout === 'double' ? 'grid-cols-2 w-full' : 
            'grid-cols-2 md:grid-cols-2 gap-2 w-full'
          }`}>
            {items.map((item, index) => (
              <div key={index} className="aspect-[16/9] bg-black/10 rounded overflow-hidden">
                {item.source ? (
                  <img 
                    src={item.source} 
                    alt={item.alt || `Imagen ${index + 1}`} 
                    className="w-full h-full object-contain"
                    style={{ maxWidth: '100%', width: '100%' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span>Imagen {index + 1} (16:9 - 1920x1080)</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
