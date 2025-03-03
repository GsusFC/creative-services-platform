'use client';

import React, { useState, useCallback, memo } from 'react';
import { useFieldMapperStore } from '@/lib/field-mapper/simplified-store';
import { Field, FieldMapping } from '@/lib/field-mapper/simplified-types';
import { Button } from '@/components/ui/button';
import { 
  PlusIcon, 
  TrashIcon, 
  ArrowRightIcon,
  AlertCircleIcon,
  CheckCircleIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SimpleFieldMapper: React.FC = () => {
  const { 
    fields, 
    mappings, 
    addField, 
    removeField, 
    addMapping, 
    removeMapping 
  } = useFieldMapperStore();

  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'number' | 'boolean' | 'date' | 'select' | 'multiselect' | 'image' | 'file'>('text');
  const [newFieldSource, setNewFieldSource] = useState<'notion' | 'website'>('notion');
  
  const handleAddField = useCallback(() => {
    if (!newFieldName.trim()) return;
    
    addField({
      id: `${Date.now()}`,
      name: newFieldName,
      type: newFieldType,
      source: newFieldSource
    });
    
    setNewFieldName('');
  }, [newFieldName, newFieldType, newFieldSource, addField]);
  
  const handleCreateMapping = useCallback((notionFieldId: string, websiteFieldId: string) => {
    addMapping(notionFieldId, websiteFieldId);
  }, [addMapping]);
  
  const notionFields = fields.filter(field => field.source === 'notion');
  const websiteFields = fields.filter(field => field.source === 'website');
  
  return (
    <div className="p-4 bg-gray-950 text-white">
      <h2 className="text-xl font-bold mb-4">Field Mapper Simple</h2>
      
      {/* Agregar nuevo campo */}
      <div className="mb-8 p-4 bg-gray-900 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Añadir nuevo campo</h3>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            placeholder="Nombre del campo"
            className="flex-grow p-2 bg-gray-800 rounded text-white"
          />
          
          <select
            value={newFieldType}
            onChange={(e) => setNewFieldType(e.target.value as any)}
            className="p-2 bg-gray-800 rounded text-white"
          >
            <option value="text">Texto</option>
            <option value="number">Número</option>
            <option value="boolean">Booleano</option>
            <option value="date">Fecha</option>
            <option value="select">Selección</option>
            <option value="multiselect">Multi-selección</option>
            <option value="image">Imagen</option>
            <option value="file">Archivo</option>
          </select>
          
          <select
            value={newFieldSource}
            onChange={(e) => setNewFieldSource(e.target.value as 'notion' | 'website')}
            className="p-2 bg-gray-800 rounded text-white"
          >
            <option value="notion">Notion</option>
            <option value="website">Sitio Web</option>
          </select>
          
          <Button 
            onClick={handleAddField}
            disabled={!newFieldName.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Añadir
          </Button>
        </div>
      </div>
      
      {/* Secciones de campos */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Campos de Notion */}
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Campos de Notion ({notionFields.length})</h3>
          {notionFields.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay campos de Notion</p>
          ) : (
            <ul className="space-y-2">
              {notionFields.map(field => (
                <FieldItem 
                  key={field.id} 
                  field={field} 
                  onRemove={removeField} 
                />
              ))}
            </ul>
          )}
        </div>
        
        {/* Campos de Website */}
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Campos del Sitio Web ({websiteFields.length})</h3>
          {websiteFields.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay campos del sitio web</p>
          ) : (
            <ul className="space-y-2">
              {websiteFields.map(field => (
                <FieldItem 
                  key={field.id} 
                  field={field} 
                  onRemove={removeField} 
                />
              ))}
            </ul>
          )}
        </div>
      </div>
      
      {/* Creador de mapeos */}
      <div className="mb-8 p-4 bg-gray-900 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Crear Mapeo</h3>
        {notionFields.length > 0 && websiteFields.length > 0 ? (
          <MappingCreator
            notionFields={notionFields}
            websiteFields={websiteFields}
            onCreateMapping={handleCreateMapping}
          />
        ) : (
          <p className="text-gray-400 text-sm">
            Añade al menos un campo de Notion y un campo del sitio web para crear mapeos
          </p>
        )}
      </div>
      
      {/* Listado de mapeos */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Mapeos Actuales ({mappings.length})</h3>
        {mappings.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay mapeos creados</p>
        ) : (
          <ul className="space-y-3">
            {mappings.map(mapping => (
              <MappingItem
                key={mapping.id}
                mapping={mapping}
                fields={fields}
                onRemove={removeMapping}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Componente para un campo individual
const FieldItem: React.FC<{
  field: Field;
  onRemove: (id: string) => void;
}> = memo(({ field, onRemove }) => {
  const handleRemove = useCallback(() => {
    onRemove(field.id);
  }, [field.id, onRemove]);
  
  return (
    <li className="flex items-center justify-between bg-gray-800 p-2 rounded">
      <div>
        <span className="font-medium">{field.name}</span>
        <Badge variant="outline" className="ml-2 text-xs">
          {field.type}
        </Badge>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </li>
  );
});

FieldItem.displayName = 'FieldItem';

// Componente para crear mapeos
const MappingCreator: React.FC<{
  notionFields: Field[];
  websiteFields: Field[];
  onCreateMapping: (notionFieldId: string, websiteFieldId: string) => void;
}> = memo(({ notionFields, websiteFields, onCreateMapping }) => {
  const [selectedNotionField, setSelectedNotionField] = useState('');
  const [selectedWebsiteField, setSelectedWebsiteField] = useState('');
  
  const handleCreateMapping = useCallback(() => {
    if (selectedNotionField && selectedWebsiteField) {
      onCreateMapping(selectedNotionField, selectedWebsiteField);
      setSelectedNotionField('');
      setSelectedWebsiteField('');
    }
  }, [selectedNotionField, selectedWebsiteField, onCreateMapping]);
  
  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedNotionField}
        onChange={(e) => setSelectedNotionField(e.target.value)}
        className="flex-grow p-2 bg-gray-800 rounded text-white"
      >
        <option value="">Seleccionar campo de Notion</option>
        {notionFields.map(field => (
          <option key={field.id} value={field.id}>
            {field.name} ({field.type})
          </option>
        ))}
      </select>
      
      <ArrowRightIcon className="h-4 w-4 text-gray-500" />
      
      <select
        value={selectedWebsiteField}
        onChange={(e) => setSelectedWebsiteField(e.target.value)}
        className="flex-grow p-2 bg-gray-800 rounded text-white"
      >
        <option value="">Seleccionar campo del sitio web</option>
        {websiteFields.map(field => (
          <option key={field.id} value={field.id}>
            {field.name} ({field.type})
          </option>
        ))}
      </select>
      
      <Button
        onClick={handleCreateMapping}
        disabled={!selectedNotionField || !selectedWebsiteField}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <PlusIcon className="h-4 w-4 mr-1" />
        Crear Mapeo
      </Button>
    </div>
  );
});

MappingCreator.displayName = 'MappingCreator';

// Componente para un mapeo individual
const MappingItem: React.FC<{
  mapping: FieldMapping;
  fields: Field[];
  onRemove: (id: string) => void;
}> = memo(({ mapping, fields, onRemove }) => {
  const notionField = fields.find(f => f.id === mapping.notionFieldId);
  const websiteField = fields.find(f => f.id === mapping.websiteFieldId);
  
  const handleRemove = useCallback(() => {
    onRemove(mapping.id);
  }, [mapping.id, onRemove]);
  
  if (!notionField || !websiteField) {
    return null;
  }
  
  const isValid = mapping.validation?.isValid ?? false;
  
  return (
    <li className={`
      p-3 rounded-md border
      ${isValid 
        ? 'border-green-900/30 bg-green-950/20' 
        : 'border-red-900/30 bg-red-950/20'
      }
    `}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isValid ? (
            <Badge variant="success" className="text-xs">
              <CheckCircleIcon className="h-3 w-3 mr-1" />
              Válido
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-xs">
              <AlertCircleIcon className="h-3 w-3 mr-1" />
              Incompatible
            </Badge>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
        <div className="bg-gray-800 p-2 rounded">
          <div className="font-medium">{notionField.name}</div>
          <div className="text-xs text-gray-400">{notionField.type}</div>
        </div>
        
        <ArrowRightIcon className="h-4 w-4 text-gray-500" />
        
        <div className="bg-gray-800 p-2 rounded">
          <div className="font-medium">{websiteField.name}</div>
          <div className="text-xs text-gray-400">{websiteField.type}</div>
        </div>
      </div>
      
      {!isValid && mapping.validation?.error && (
        <div className="mt-2 text-xs text-amber-400">
          <AlertCircleIcon className="h-3 w-3 inline mr-1" />
          {mapping.validation.error}
        </div>
      )}
    </li>
  );
});

MappingItem.displayName = 'MappingItem';

export default SimpleFieldMapper;
