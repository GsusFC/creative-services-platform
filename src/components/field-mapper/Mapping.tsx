'use client';

import React, { useState } from 'react';
import { useFieldMapperStore } from '@/lib/field-mapper/store';
import { FieldMapping } from '@/lib/field-mapper/types';
import { Button } from '@/components/ui/button';
import { XIcon, AlertCircleIcon, ChevronDownIcon, InfoIcon, ArrowRightIcon, CheckIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { validateTypeCompatibility } from '@/lib/field-mapper/validation';

interface MappingProps {
  mapping: FieldMapping;
  index: number;
}

export const Mapping: React.FC<MappingProps> = ({
  mapping,
  index
}) => {
  // Usar el store
  const updateMapping = useFieldMapperStore(state => state.updateMapping);
  const removeMapping = useFieldMapperStore(state => state.removeMapping);
  const notionFields = useFieldMapperStore(state => state.notionFields);
  const websiteFields = useFieldMapperStore(state => state.websiteFields);
  
  const [showNotionFieldDropdown, setShowNotionFieldDropdown] = useState(false);
  const [showWebsiteFieldDropdown, setShowWebsiteFieldDropdown] = useState(false);
  const [showTypeDetails, setShowTypeDetails] = useState(false);

  // Find notion field details
  const notionField = notionFields.find(f => f.id === mapping.notionField);
  const notionFieldName = notionField ? notionField.name : 'Seleccionar campo de Notion';
  const notionFieldType = notionField ? notionField.type : '';

  // Find website field details
  const websiteField = websiteFields.find(f => f.id === mapping.websiteField);
  const websiteFieldName = websiteField ? websiteField.name : 'Seleccionar campo del sitio web';
  const websiteFieldType = websiteField ? websiteField.type : '';

  // Validate type compatibility
  const validation = notionFieldType && websiteFieldType
    ? validateTypeCompatibility(notionFieldType, websiteFieldType)
    : { isValid: false, error: 'Selecciona ambos campos para validar la compatibilidad' };

  // Determinar si el mapping está completo
  const isComplete = mapping.notionField && mapping.websiteField;
  const isValid = validation.isValid;

  // Handlers
  const handleNotionFieldChange = (fieldId: string) => {
    updateMapping(index, {
      ...mapping,
      notionField: fieldId,
    });
    setShowNotionFieldDropdown(false);
  };

  const handleWebsiteFieldChange = (fieldId: string) => {
    updateMapping(index, {
      ...mapping,
      websiteField: fieldId,
    });
    setShowWebsiteFieldDropdown(false);
  };

  const handleRemoveMapping = () => {
    removeMapping(index);
  };

  return (
    <div
      className={`
        p-3 rounded-md border 
        ${isComplete && isValid 
          ? 'border-green-900/30 bg-green-950/20' 
          : !isComplete 
            ? 'border-gray-800 bg-gray-900/50' 
            : 'border-red-900/30 bg-red-950/20'
        }
        transition-colors
      `}
    >
      <div className="flex items-center justify-between gap-2 mb-2">        
        <div className="flex-grow flex items-center gap-2">
          {isComplete && isValid && (
            <Badge variant="success" className="text-[10px]">
              <CheckIcon className="h-3 w-3 mr-1" />
              Válido
            </Badge>
          )}
          
          {isComplete && !isValid && (
            <Badge variant="warning" className="text-[10px]">
              <AlertCircleIcon className="h-3 w-3 mr-1" />
              Incompatible
            </Badge>
          )}
        </div>
        
        <button
          onClick={handleRemoveMapping}
          className="p-1 text-gray-500 hover:text-red-400 rounded"
        >
          <XIcon className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        {/* Notion Field Selector */}
        <div className="mb-2 relative">
          <div 
            onClick={() => setShowNotionFieldDropdown(!showNotionFieldDropdown)}
            className={`
              flex items-center justify-between p-2.5 rounded cursor-pointer
              ${notionField ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/40' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'}
            `}
          >
            <div className="flex items-center gap-2">
              <div 
                className="text-sm font-medium" 
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                {notionFieldName}
              </div>
              
              {notionFieldType && (
                <Badge variant="outline" className="text-xs py-0 px-1.5 h-5 bg-blue-950 border-blue-800 text-blue-300">
                  {notionFieldType}
                </Badge>
              )}
            </div>
          </div>
          
          {showNotionFieldDropdown && (
            <div className="absolute z-10 mt-1 w-full max-h-[200px] overflow-y-auto bg-gray-900 border border-gray-800 rounded-md shadow-lg">
              <div className="p-1">
                {notionFields.map((field) => (
                  <button
                    key={field.id}
                    onClick={() => handleNotionFieldChange(field.id)}
                    className={`
                      w-full p-2 text-sm text-left rounded flex items-center justify-between hover:bg-gray-800
                      ${mapping.notionField === field.id ? 'bg-blue-900/30 text-blue-300' : 'text-gray-300'}
                    `}
                  >
                    <span className="truncate">{field.name}</span>
                    <Badge variant="notion" className="text-[10px]">{field.type}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Arrow */}
        <div className="flex items-center justify-center">
          <ArrowRightIcon className="h-4 w-4 text-gray-500" />
        </div>
        
        {/* Website Field Selector */}
        <div className="mb-2 relative">
          <div 
            onClick={() => setShowWebsiteFieldDropdown(!showWebsiteFieldDropdown)}
            className={`
              flex items-center justify-between p-2.5 rounded cursor-pointer
              ${websiteField ? 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/40' : 'bg-gray-900 text-gray-400 hover:bg-gray-800'}
            `}
          >
            <div className="flex items-center gap-2">
              <div 
                className="text-sm font-medium" 
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                {websiteFieldName}
              </div>
              
              {websiteFieldType && (
                <Badge variant="outline" className="text-xs py-0 px-1.5 h-5 bg-purple-950 border-purple-800 text-purple-300">
                  {websiteFieldType}
                </Badge>
              )}
            </div>
          </div>
          
          {showWebsiteFieldDropdown && (
            <div className="absolute z-10 mt-1 w-full max-h-[200px] overflow-y-auto bg-gray-900 border border-gray-800 rounded-md shadow-lg">
              <div className="p-1">
                {websiteFields.map((field) => (
                  <button
                    key={field.id}
                    onClick={() => handleWebsiteFieldChange(field.id)}
                    className={`
                      w-full p-2 text-sm text-left rounded flex items-center justify-between hover:bg-gray-800
                      ${mapping.websiteField === field.id ? 'bg-purple-900/30 text-purple-300' : 'text-gray-300'}
                    `}
                  >
                    <span className="truncate">{field.name}</span>
                    <Badge variant="website" className="text-[10px]">{field.type}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Error message if incompatible */}
      {isComplete && !isValid && (
        <div 
          className="mt-2 p-2 bg-red-950/30 border border-red-900/30 rounded-md text-xs text-red-300"
        >
          <div className="flex gap-2">
            <div>
              <AlertCircleIcon className="h-4 w-4 text-red-400" />
            </div>
            <div>
              <p>{validation.error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Type compatibility info */}
      {isComplete && (
        <div className="mt-2">
          <button
            onClick={() => setShowTypeDetails(!showTypeDetails)}
            className="text-xs text-gray-500 hover:text-gray-400 flex items-center gap-1"
          >
            <InfoIcon className="h-3 w-3" />
            <span>
              {showTypeDetails ? 'Ocultar' : 'Mostrar'} detalles de compatibilidad
            </span>
          </button>
          
          {showTypeDetails && (
            <div className="mt-2 p-2 bg-gray-900 border border-gray-800 rounded-md text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-400 mb-1 font-medium">Campo de Notion:</p>
                  <p className="text-gray-300">{notionFieldName}</p>
                  <p className="text-gray-500 mt-1">Tipo: <span className="text-blue-300">{notionFieldType}</span></p>
                </div>
                <div>
                  <p className="text-purple-400 mb-1 font-medium">Campo del Sitio Web:</p>
                  <p className="text-gray-300">{websiteFieldName}</p>
                  <p className="text-gray-500 mt-1">Tipo: <span className="text-purple-300">{websiteFieldType}</span></p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
