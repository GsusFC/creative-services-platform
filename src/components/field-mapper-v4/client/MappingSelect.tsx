'use client';

/**
 * Selector de Mapeo
 * 
 * Componente para seleccionar un campo de Notion para mapear a un campo del Case Study
 */

import { useState, useRef, useEffect } from 'react';
import { CaseStudyField, NotionField, CompatibilityStatus } from '@/lib/field-mapper-v4/types';
import { getRecommendedFields, checkFieldCompatibility } from '@/lib/field-mapper-v4/validation';
import { getTransformation } from '@/lib/field-mapper-v4/transformations';
import CompatibilityIndicator from './CompatibilityIndicator';

interface MappingSelectProps {
  caseStudyField: CaseStudyField;
  notionFields: NotionField[];
  selectedNotionFieldId: string | null;
  onSelect: (notionFieldId: string | null) => void;
}

export default function MappingSelect({
  caseStudyField,
  notionFields,
  selectedNotionFieldId,
  onSelect,
}: MappingSelectProps) {
  // Estados
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Obtener las recomendaciones
  const recommendations = getRecommendedFields(notionFields, caseStudyField);
  
  // Obtener el campo seleccionado actualmente
  const selectedField = notionFields.find(f => f.id === selectedNotionFieldId);
  
  // Obtener información de compatibilidad para el campo seleccionado
  const compatibilityInfo = selectedField 
    ? checkFieldCompatibility(selectedField, caseStudyField) 
    : null;
  
  // Manejar clic fuera del dropdown para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filtrar campos según término de búsqueda
  const filterFields = (fields: NotionField[]) => {
    if (!searchTerm) return fields;
    return fields.filter(field => 
      field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Obtener icono según tipo de campo
  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'text':
        return '📝';
      case 'rich_text':
        return '📄';
      case 'number':
        return '🔢';
      case 'date':
        return '📅';
      case 'image':
        return '🖼️';
      case 'file':
        return '📎';
      case 'files':
        return '🖼️';
      case 'select':
        return '🔽';
      case 'multi_select':
        return '🏷️';
      case 'url':
        return '🔗';
      case 'email':
        return '📧';
      case 'checkbox':
        return '✅';
      default:
        return '❓';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón del selector */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-2 text-left border rounded ${
          selectedField ? 'bg-gray-800 border-blue-700 text-white' : 'bg-gray-800 border-gray-700 text-gray-300'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedField ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">{getFieldIcon(selectedField.type)}</span>
              <span>{selectedField.name}</span>
              {compatibilityInfo && (
                <span className="ml-2">
                  <CompatibilityIndicator 
                    status={compatibilityInfo.status} 
                    transformationId={compatibilityInfo.transformationId}
                    compact={true}
                  />
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect(null);
              }}
              className="p-1 text-gray-400 rounded hover:bg-gray-700"
              aria-label="Eliminar mapeo"
            >
              ✕
            </button>
          </div>
        ) : (
          <span className="text-gray-400">Seleccionar campo ▾</span>
        )}
      </button>
      
      {/* Información de tipo y compatibilidad */}
      {selectedField && (
        <div className="mt-1 text-xs text-gray-400">
          Tipo: {selectedField.type}
        </div>
      )}
      
      {/* Dropdown de selección */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 border border-gray-700 rounded-md shadow-lg bg-gray-800">
          {/* Barra de búsqueda */}
          <div className="p-2 border-b border-gray-700">
            <input
              type="text"
              placeholder="Buscar campo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded bg-gray-900 text-white placeholder-gray-400"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          {/* Lista de campos */}
          <div className="max-h-60 overflow-y-auto">
            {/* Sección de campos recomendados */}
            {recommendations.directlyCompatible.length > 0 && (
              <div className="px-2 py-1 text-xs font-semibold text-gray-400 border-b border-gray-700 bg-gray-900">
                Recomendados
              </div>
            )}
            
            {filterFields(recommendations.directlyCompatible).map(field => (
              <button
                key={field.id}
                onClick={() => {
                  onSelect(field.id);
                  setIsOpen(false);
                }}
                className="flex items-center w-full p-2 text-left hover:bg-gray-700 text-white"
              >
                <span className="mr-2">{getFieldIcon(field.type)}</span>
                <span className="flex-grow">{field.name}</span>
                <span className="text-xs text-gray-400">{field.type}</span>
              </button>
            ))}
            
            {/* Campos que requieren transformación */}
            {recommendations.requiresTransformation.length > 0 && (
              <div className="px-2 py-1 text-xs font-semibold text-gray-400 border-t border-b border-gray-700 bg-gray-900">
                Requieren transformación
              </div>
            )}
            
            {filterFields(recommendations.requiresTransformation).map(field => (
              <button
                key={field.id}
                onClick={() => {
                  onSelect(field.id);
                  setIsOpen(false);
                }}
                className="flex items-center w-full p-2 text-left hover:bg-gray-700 text-white"
              >
                <span className="mr-2">{getFieldIcon(field.type)}</span>
                <span className="flex-grow">{field.name}</span>
                <span className="text-xs text-gray-400">{field.type}</span>
              </button>
            ))}
            
            {/* Todos los campos */}
            {recommendations.directlyCompatible.length > 0 || recommendations.requiresTransformation.length > 0 ? (
              <div className="px-2 py-1 text-xs font-semibold text-gray-400 border-t border-b border-gray-700 bg-gray-900">
                Todos los campos
              </div>
            ) : null}
            
            {filterFields(notionFields)
              .filter(field => 
                !recommendations.directlyCompatible.some(r => r.id === field.id) && 
                !recommendations.requiresTransformation.some(r => r.id === field.id)
              )
              .map(field => (
                <button
                  key={field.id}
                  onClick={() => {
                    onSelect(field.id);
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full p-2 text-left hover:bg-gray-700 text-white"
                >
                  <span className="mr-2">{getFieldIcon(field.type)}</span>
                  <span className="flex-grow">{field.name}</span>
                  <span className="text-xs text-gray-400">{field.type}</span>
                </button>
              ))}
              
            {filterFields(notionFields).length === 0 && (
              <div className="p-2 text-center text-gray-400">
                No se encontraron campos
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
