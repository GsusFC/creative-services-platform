'use client';

/**
 * Estructura de Case Study
 * 
 * Muestra la estructura jerárquica del Case Study,
 * organizando los campos por secciones y permitiendo
 * al usuario mapear campos de Notion
 */

import { CaseStudyField, FieldMapping, NotionField, CompatibilityStatus, FieldType } from '@/lib/field-mapper-v4/types';
import { checkFieldCompatibility } from '@/lib/field-mapper-v4/compatibility';
import { applyTransformation } from '@/lib/field-mapper-v4/transformations';
import MappingSelect from './MappingSelect';
import ConnectionLine from './ConnectionLine';
import { useState } from 'react';

interface CaseStudyStructureProps {
  fields: CaseStudyField[];
  notionFields: NotionField[];
  mappings: FieldMapping[];
  onMapField: (caseStudyFieldId: string, notionFieldId: string) => void;
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
  onMapField,
  onSetTransformation,
}: CaseStudyStructureProps) {
  // Estado para transformaciones
  const [transformations, setTransformations] = useState<Record<string, string>>({});
  
  // Organizar campos por secciones
  const sections: Section[] = fields.reduce((acc, field) => {
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
      <h2 className="mb-4 text-lg font-semibold text-white">Estructura de Case Study</h2>
      
      <div className="space-y-6">
        {sections.map(section => (
          <div key={section.id} className="p-4 border border-gray-700 rounded-lg bg-gray-800">
            <h3 className="mb-3 text-base font-medium text-white">{section.name}</h3>
            
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
                  ? checkFieldCompatibility(field.type as FieldType, mappedNotionField.type as FieldType)
                  : CompatibilityStatus.INCOMPATIBLE;
                
                // Clave para la transformación
                const transformationKey = mappedNotionFieldId 
                  ? `${field.id}:${mappedNotionFieldId}` 
                  : '';
                const selectedTransformation = transformationKey 
                  ? transformations[transformationKey] 
                  : undefined;
                
                return (
                  <div key={field.id} className="p-3 bg-gray-900 border border-gray-700 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center">
                        <span className="font-medium text-white">{field.name}</span>
                        {field.required && (
                          <span className="ml-1 text-sm text-red-500">*</span>
                        )}
                      </div>
                      <span className="px-2 py-1 text-xs text-gray-300 bg-gray-800 rounded-full">
                        {field.type}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-400 mb-2">
                      {field.description || 'Sin descripción'}
                    </div>
                    
                    {/* Selector de campos de Notion */}
                    <MappingSelect
                      caseStudyField={field}
                      notionFields={notionFields}
                      selectedNotionFieldId={mappedNotionFieldId}
                      onChange={(notionFieldId) => onMapField(field.id, notionFieldId)}
                    />
                    
                    {/* Línea de conexión */}
                    {mappedNotionFieldId && mappedNotionField && (
                      <div className="mt-1">
                        <ConnectionLine 
                          status={compatibility}
                          sourceType={mappedNotionField.type as FieldType}
                          targetType={field.type as FieldType}
                          onApplyTransformation={
                            compatibility === CompatibilityStatus.REQUIRES_TRANSFORMATION 
                              ? (transformationId) => handleApplyTransformation(field.id, mappedNotionFieldId, transformationId)
                              : undefined
                          }
                        />
                        
                        {selectedTransformation && compatibility === CompatibilityStatus.REQUIRES_TRANSFORMATION && (
                          <div className="mt-1 p-1 text-xs bg-blue-50 border border-blue-100 rounded text-blue-800">
                            Transformación aplicada: <span className="font-medium">{selectedTransformation}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
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
