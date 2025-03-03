'use client';

import React, { useState } from 'react';
import { useFieldMapperStore } from '@/lib/field-mapper/store';
import { Input } from '@/components/ui/input';
import { 
  FileIcon, 
  CalendarIcon, 
  CheckSquareIcon, 
  SearchIcon, 
  FileTextIcon,
  HashIcon,
  ListIcon,
  GlobeIcon,
  MailIcon,
  ImageIcon,
  BoxIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PlusIcon } from 'lucide-react';

interface FieldListProps {
  source: 'notion' | 'website';
  listId: string;
  className?: string;
}

interface FieldItemProps {
  field: any;
  isNotion: boolean;
  onAddMapping: () => void;
}

export default function FieldList({ source, listId, className = '' }: FieldListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Acceder al store directamente
  const store = useFieldMapperStore();
  const notionFields = store.notionFields;
  const websiteFields = store.websiteFields;
  const addMapping = store.addMapping;
  
  const fields = source === 'notion' ? notionFields : websiteFields;
  
  // Determinar si es una lista de Notion o del sitio web
  const isNotion = source === 'notion';

  // Si no hay campos para mostrar
  if (!fields || fields.length === 0) {
    return (
      <div 
        className="min-h-[120px] flex items-center justify-center border-2 border-dashed border-gray-700/30 rounded-md p-4"
      >
        <div className="text-center">
          <p className="text-sm text-gray-500">
            {isNotion 
              ? "No se han cargado campos de Notion" 
              : "No hay campos disponibles"
            }
          </p>
        </div>
      </div>
    );
  }

  // Filtrar los campos según el término de búsqueda
  const filteredFields = fields.filter(field => 
    !searchTerm || field.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Renderizar la lista de campos en formato plano
  return (
    <div className="space-y-2">
      <div className="mb-3">
        <div className="relative">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder={`Buscar campos...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-900/50 border-gray-800 placeholder:text-gray-600 text-sm pl-8"
          />
        </div>
      </div>
      
      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredFields.map(field => (
          <FieldItem 
            key={field.id} 
            field={field} 
            isNotion={isNotion}
            onAddMapping={() => {
              if (isNotion) {
                addMapping({ notionField: field.id, websiteField: '' });
              } else {
                addMapping({ notionField: '', websiteField: field.id });
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Componente para mostrar un campo individual
function FieldItem({ field, isNotion, onAddMapping }: FieldItemProps) {
  // Función para obtener el icono apropiado según el tipo de campo
  const getTypeIcon = () => {
    const type = field.type.toLowerCase();
    
    if (type.includes('text') || type.includes('string') || type.includes('title')) {
      return <FileTextIcon className="h-4 w-4 text-blue-500" />;
    } 
    else if (type.includes('number') || type.includes('integer') || type.includes('float')) {
      return <HashIcon className="h-4 w-4 text-amber-500" />;
    } 
    else if (type.includes('select') || type.includes('multi') || type.includes('enum')) {
      return <ListIcon className="h-4 w-4 text-green-500" />;
    } 
    else if (type.includes('date') || type.includes('time')) {
      return <CalendarIcon className="h-4 w-4 text-violet-500" />;
    } 
    else if (type.includes('url') || type.includes('link')) {
      return <GlobeIcon className="h-4 w-4 text-sky-500" />;
    } 
    else if (type.includes('email')) {
      return <MailIcon className="h-4 w-4 text-red-500" />;
    } 
    else if (type.includes('file') || type.includes('image') || type.includes('media')) {
      return <ImageIcon className="h-4 w-4 text-purple-500" />;
    } 
    
    // Icono predeterminado para otros tipos
    return <BoxIcon className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="flex items-center justify-between bg-gray-900/50 border border-gray-800 hover:border-gray-700 rounded-md p-2.5">
      <div className="flex items-center gap-2.5">
        {getTypeIcon()}
        <span 
          className="text-sm font-medium text-gray-300" 
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          {field.name}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge 
          variant="outline" 
          className="text-xs py-0 h-5 min-w-14 text-center bg-gray-950/60 border-gray-800"
        >
          {field.type}
        </Badge>
        
        <button
          type="button"
          onClick={onAddMapping}
          className="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-800"
          title={isNotion 
            ? "Asignar a campo del sitio web" 
            : "Asignar a campo de Notion"
          }
        >
          <PlusIcon className="h-4 w-4 text-gray-400" />
          <span className="sr-only">Asignar</span>
        </button>
      </div>
    </div>
  );
}
