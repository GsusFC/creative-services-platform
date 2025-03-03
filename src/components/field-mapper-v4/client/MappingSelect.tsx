'use client';

/**
 * Selector de Mapeo
 * 
 * Componente para seleccionar un campo de Notion para mapear a un campo del Case Study
 */

import { useState, useRef, useEffect } from 'react';
import { CaseStudyField, NotionField, FieldType } from '@/lib/field-mapper-v4/types';
import { getRecommendedFields, checkFieldCompatibility } from '@/lib/field-mapper-v4/validation';
import CompatibilityIndicator from './CompatibilityIndicator';

interface MappingSelectProps {
  caseStudyField: CaseStudyField;
  notionFields: NotionField[];
  selectedNotionFieldId: string | null;
  onChangeAction: (notionFieldId: string | null) => void;
}

export default function MappingSelect({
  caseStudyField,
  notionFields,
  selectedNotionFieldId,
  onChangeAction,
}: MappingSelectProps) {
  // Estados
  const [isOpen, setIsOpen] = useState(false);
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

  // Nota: Función de iconos pendiente de implementar

  return (
    <div className="relative w-[95%] mx-auto" ref={dropdownRef}>
      {/* Botón del selector */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full p-2 text-left rounded-lg focus:outline-none focus:ring-1 transition-all duration-200
          ${selectedField 
            ? 'bg-black/40 border border-white/10 hover:bg-white/5 text-white/90' 
            : 'bg-black/40 border border-white/10 hover:bg-white/5 text-white/70'}
          cursor-pointer
        `}
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        {selectedField ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="font-mono">{selectedField.name}</span>
              <span className="ml-2 text-xs text-white/70 font-mono">
                {selectedField.type}
              </span>
              {compatibilityInfo && (
                <span className="ml-2">
                  <CompatibilityIndicator 
                    status={compatibilityInfo.status} 
                    compact={true}
                    notionType={selectedField.type as FieldType}
                    caseStudyType={caseStudyField.type as FieldType}
                  />
                </span>
              )}
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onChangeAction(null);
              }}
              className="p-1 text-notion-text hover:bg-notion-border/30 rounded transition-colors cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="Eliminar mapeo"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onChangeAction(null);
                }
              }}
            >
              <span className="w-4 h-4 flex items-center justify-center">✕</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-white/70 font-mono">
            <span>Seleccionar campo</span>
            <span>▾</span>
          </div>
        )}
      </div>
      
      {/* Dropdown de selección */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 shadow-md bg-black/60 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10">
          {/* Lista de campos */}
          <div className="max-h-60 overflow-y-auto">
            {/* Sección de campos recomendados */}
            {recommendations.directlyCompatible.length > 0 && (
              <div className="px-3 py-1.5 text-xs font-medium bg-black/40 text-white/80 font-mono">
                Recomendados
              </div>
            )}
            
            {recommendations.directlyCompatible.map(field => (
              <button
                key={field.id}
                onClick={() => {
                  onChangeAction(field.id);
                  setIsOpen(false);
                }}
                className="flex items-center w-full p-2 text-left hover:bg-white/5 text-white/90 focus:outline-none transition-colors"
              >
                <span className="flex-grow font-mono truncate">{field.name}</span>
                <span className="text-xs text-white/70 font-mono ml-2 shrink-0">
                  {field.type}
                </span>
              </button>
            ))}
            
            {/* Campos que requieren transformación */}
            {recommendations.requiresTransformation.length > 0 && (
              <div className="px-3 py-1.5 text-xs font-medium mt-1 bg-gray-700/50 text-white/80 font-geist-mono">
                Requieren transformación
              </div>
            )}
            
            {recommendations.requiresTransformation.map(field => (
              <button
                key={field.id}
                onClick={() => {
                  onChangeAction(field.id);
                  setIsOpen(false);
                }}
                className="flex items-center w-full p-2 text-left hover:bg-white/5 text-white/90 focus:outline-none transition-colors"
              >
                <span className="flex-grow font-mono truncate">{field.name}</span>
                <span className="text-xs text-white/70 font-mono ml-2 shrink-0">
                  {field.type}
                </span>
              </button>
            ))}
            
            {/* Todos los campos */}
            {(recommendations.directlyCompatible.length > 0 || recommendations.requiresTransformation.length > 0) && (
              <div className="px-3 py-1.5 text-xs font-medium mt-1 bg-gray-700/50 text-white/80 font-geist-mono">
                Todos los campos
              </div>
            )}
            
            {notionFields
              .filter(field => 
                !recommendations.directlyCompatible.some(r => r.id === field.id) && 
                !recommendations.requiresTransformation.some(r => r.id === field.id)
              )
              .map(field => (
                <button
                  key={field.id}
                  onClick={() => {
                    onChangeAction(field.id);
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full p-2 text-left hover:bg-white/5 text-white/90 focus:outline-none transition-colors"
                >
                  <span className="flex-grow font-mono truncate">{field.name}</span>
                  <span className="text-xs text-white/70 font-mono ml-2 shrink-0">
                    {field.type}
                  </span>
                </button>
              ))}
              
            {/* Estado vacío */}
            {notionFields.length === 0 && (
              <div className="p-4 text-center text-white/50 bg-gray-800/90 font-geist-mono">
                No se encontraron campos
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
