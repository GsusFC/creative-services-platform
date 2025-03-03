'use client';

/**
 * Estructura de Case Study
 * 
 * Muestra la estructura jerárquica del Case Study,
 * organizando los campos por secciones y permitiendo
 * al usuario mapear campos de Notion
 */

import { CaseStudyField, FieldMapping, NotionField, CompatibilityStatus, FieldType } from '@/lib/field-mapper-v4/types';
import { checkFieldCompatibility } from '@/lib/field-mapper-v4/validation';
import { useState, useEffect, useMemo } from 'react';

import MappingSelect from './MappingSelect';

interface CaseStudyStructureProps {
  fields: CaseStudyField[];
  notionFields: NotionField[];
  mappings: FieldMapping[];
  onMapFieldAction: (caseStudyFieldId: string, notionFieldId: string) => void;
  onSetTransformation?: (mapping: FieldMapping, transformationId: string) => void;
}

// Agrupar campos por sección
type Section = {
  id: string;
  name: string;
  fields: CaseStudyField[];
};

export default function CaseStudyStructure({
  fields,
  notionFields,
  mappings,
  onMapFieldAction,
  onSetTransformation,
}: CaseStudyStructureProps) {
  // Estado para transformaciones
  const [transformations, setTransformations] = useState<Record<string, string>>({});
  // Estado para seguimiento de secciones completadas
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({});
  
  // Organizar campos por secciones - Memoizamos el resultado para evitar recálculos innecesarios
  const sections: Section[] = useMemo(() => {
    return fields.reduce((acc, field) => {
      const sectionId = field.section || 'general';
      const existingSection = acc.find(section => section.id === sectionId);
      
      if (existingSection) {
        existingSection.fields.push(field);
      } else {
        acc.push({
          id: sectionId,
          name: getSectionName(sectionId),
          fields: [field],
        });
      }
      
      return acc;
    }, [] as Section[]);
  }, [fields]); // Solo recalcular cuando fields cambie
  
  // Calcular secciones completadas cuando cambian los mappings
  useEffect(() => {
    const newCompletedSections: Record<string, boolean> = {};
    
    sections.forEach(section => {
      const requiredFields = section.fields.filter(field => field.required);
      const mappedRequiredFields = requiredFields.filter(field => 
        mappings.some(mapping => mapping.caseStudyFieldId === field.id)
      );
      
      newCompletedSections[section.id] = requiredFields.length > 0 ? 
        mappedRequiredFields.length === requiredFields.length : 
        section.fields.every(field => mappings.some(mapping => mapping.caseStudyFieldId === field.id));
    });
    
    setCompletedSections(newCompletedSections);
  }, [mappings, fields, sections]); // Incluimos sections en las dependencias
  
  // Manejar aplicación de transformación
  const handleApplyTransformation = (caseStudyFieldId: string, notionFieldId: string, transformationId: string) => {
    // Guardar transformación en estado
    setTransformations(prev => ({
      ...prev,
      [`${caseStudyFieldId}:${notionFieldId}`]: transformationId
    }));
    
    // Notificar al componente padre si existe el callback
    if (onSetTransformation) {
      const mapping = mappings.find(m => 
        m.caseStudyFieldId === caseStudyFieldId && m.notionFieldId === notionFieldId
      );
      
      if (mapping) {
        onSetTransformation(mapping, transformationId);
      }
    }
  };
  
  return (
    <div className="h-full">
      <h2 className="mb-4 text-lg font-medium text-teal-400 font-mono border-b border-white/10 pb-2 flex items-center gap-2">
        Estructura de Case Study
      </h2>
      
      <div className="space-y-4 divide-y divide-white/10">
        {sections.map(section => {
          const isCompleted = completedSections[section.id] || false;
          const totalFields = section.fields.length;
          const mappedFields = section.fields.filter(field => 
            mappings.some(mapping => mapping.caseStudyFieldId === field.id)
          ).length;
          const progressPercentage = Math.round((mappedFields / totalFields) * 100);
          
          return (
            <div 
              key={section.id} 
              className={`
                p-4 pt-3 rounded-lg bg-black/40 border border-white/10
                ${isCompleted ? 'border-teal-500/30 shadow-sm shadow-teal-500/10' : ''}
                transition-all duration-200
              `}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-white/90 font-mono">{section.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-white/70 font-mono">
                    {mappedFields}/{totalFields} campos
                  </span>
                  <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal-500/70 transition-all duration-300 ease-in-out" 
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  {isCompleted && (
                    <span className="text-xs px-1.5 py-0.5 bg-teal-500/20 text-teal-400 rounded font-mono">
                      Completa
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                {section.fields.map(field => {
                  // Buscar mapeo actual para este campo
                  const mapping = mappings.find(m => m.caseStudyFieldId === field.id);
                  const mappedNotionFieldId = mapping ? mapping.notionFieldId : null;
                  const mappedNotionField = mappedNotionFieldId 
                    ? notionFields.find(f => f.id === mappedNotionFieldId) 
                    : undefined;
                  
                  // Determinar compatibilidad
                  const compatibility = mappedNotionField 
                    ? checkFieldCompatibility(mappedNotionField, field).status
                    : CompatibilityStatus.INCOMPATIBLE;
                  
                  // Clave para la transformación
                  const transformationKey = mappedNotionFieldId 
                    ? `${field.id}:${mappedNotionFieldId}` 
                    : '';
                  const selectedTransformation = transformationKey 
                    ? transformations[transformationKey] 
                    : undefined;
                  
                  // Calcular clases según estado
                  const isMapped = !!mappedNotionField;
                  const needsTransformation = compatibility === CompatibilityStatus.REQUIRES_TRANSFORMATION;
                  const isCompatible = compatibility === CompatibilityStatus.COMPATIBLE;
                  const hasTransformation = !!selectedTransformation;
                  
                  return (
                    <div 
                      key={field.id} 
                      className={`
                        py-3 px-3 bg-black/30 mb-2 rounded-lg border
                        ${field.required ? 'border-white/20' : 'border-white/10'} 
                        ${!isMapped ? 'hover:bg-white/5' : 
                          isCompatible ? 'border-l-4 border-l-teal-500/70 border-t border-r border-b border-white/10' : 
                          needsTransformation && hasTransformation ? 'border-l-4 border-l-amber-500/70 border-t border-r border-b border-white/10' : 
                          'border-l-4 border-l-red-500/70 border-t border-r border-b border-white/10'
                        } 
                        transition-all duration-200
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <span className="font-medium text-white/90 text-sm font-mono">{field.name}</span>
                            {field.required && (
                              <span className="ml-1 text-xs px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded-full font-mono">
                                Requerido
                              </span>
                            )}
                          </div>
                          {field.description && (
                            <div className="text-xs text-white/60 mt-1 font-mono">
                              {field.description}
                            </div>
                          )}
                        </div>
                        <span className="text-xs px-1.5 py-0.5 bg-black/40 border border-white/10 text-white/70 rounded font-mono">
                          {field.type}
                        </span>
                      </div>
                      
                      {/* Selector de campos de Notion */}
                      <div className="mt-1.5">
                        <MappingSelect
                          caseStudyField={field}
                          notionFields={notionFields}
                          selectedNotionFieldId={mappedNotionFieldId}
                          onChangeAction={(notionFieldId) => {
                            onMapFieldAction(field.id, notionFieldId || '');
                            if (notionFieldId) {
                              // Comprobar si la nueva combinación necesita transformación
                              const newNotionField = notionFields.find(f => f.id === notionFieldId);
                              if (newNotionField) {
                                const newCompatibility = checkFieldCompatibility(
                                  newNotionField, 
                                  field
                                ).status;
                                
                                if (newCompatibility === CompatibilityStatus.REQUIRES_TRANSFORMATION &&
                                    onSetTransformation && transformations[`${field.id}:${notionFieldId}`]) {
                                  // Aplicar transformación anterior si existe
                                  handleApplyTransformation(
                                    field.id, 
                                    notionFieldId, 
                                    transformations[`${field.id}:${notionFieldId}`]
                                  );
                                }
                              }
                            }
                          }}
                        />
                      </div>
                      
                      {/* Información de mapeo y compatibilidad */}
                      {mappedNotionField && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                          {needsTransformation && !hasTransformation && (
                            <button 
                              className="text-xs px-3 py-1.5 text-amber-400 bg-amber-500/10 rounded-lg hover:bg-amber-500/20 transition-colors font-mono w-full text-center border border-amber-500/30"
                              onClick={() => {
                                // Aquí activaríamos el TransformationManager
                                // Por ahora simulamos una transformación simple para ejemplo
                                if (mappedNotionFieldId && !selectedTransformation) {
                                  handleApplyTransformation(field.id, mappedNotionFieldId, 'transform_auto');
                                }
                              }}
                            >
                              Aplicar transformación
                            </button>
                          )}
                          
                          {hasTransformation && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-teal-400 font-mono">
                                Transformación aplicada
                              </span>
                              <button 
                                className="text-xs px-2 py-1 text-amber-400 bg-amber-500/10 rounded-lg hover:bg-amber-500/20 transition-colors font-mono border border-amber-500/30"
                                onClick={() => {
                                  // Editar transformación existente
                                  if (mappedNotionFieldId) {
                                    // Lógica para editar
                                  }
                                }}
                              >
                                Editar
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Obtener nombre de sección
const getSectionName = (id: string) => {
  switch (id) {
    case 'general': return 'Información General';
    case 'client': return 'Cliente';
    case 'project': return 'Proyecto';
    case 'delivery': return 'Entrega';
    case 'results': return 'Resultados';
    default: return id.charAt(0).toUpperCase() + id.slice(1);
  }
};
