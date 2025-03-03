'use client';

/**
 * Previsualización de Mapeo
 * 
 * Componente que muestra una previsualización de cómo se verán los datos
 * mapeados en la estructura del Case Study
 */

import { useState } from 'react';
import { CaseStudyField, FieldMapping, NotionField, FieldType, CompatibilityStatus } from '@/lib/field-mapper-v4/types';
import { getTransformation } from '@/lib/field-mapper-v4/transformations';
import { checkFieldCompatibility } from '@/lib/field-mapper-v4/validation';

interface MappingPreviewProps {
  caseStudyFields: CaseStudyField[];
  notionFields: NotionField[];
  mappings: FieldMapping[];
  onCloseAction: () => void;
}

type PreviewData = {
  caseStudyFieldId: string;
  caseStudyFieldName: string;
  notionFieldName: string;
  sampleValue: unknown;
  displayValue: string;
  hasTransformation: boolean;
  transformationId?: string;
  transformationName?: string;
};

export default function MappingPreview({
  caseStudyFields,
  notionFields,
  mappings,
  onCloseAction,
}: MappingPreviewProps) {
  const [isLoading] = useState(false);
  
  // Generar datos de previsualización
  const previewData: PreviewData[] = mappings.map(mapping => {
    const notionField = notionFields.find(f => f.id === mapping.notionFieldId);
    const caseStudyField = caseStudyFields.find(f => f.id === mapping.caseStudyFieldId);
    
    if (!notionField || !caseStudyField) return null;
    
    // Obtener estado de compatibilidad
    const compatibility = checkFieldCompatibility(
      notionField,
      caseStudyField
    ).status;
    
    // Generar valor de ejemplo según el tipo de campo
    const sampleValue = generateSampleValue(notionField.type);
    let displayValue = String(sampleValue);
    const transformationId = mapping.transformationId;
    let transformationName = null;
    
    // Si hay una transformación configurada o se requiere una
    if (compatibility === CompatibilityStatus.REQUIRES_TRANSFORMATION) {
      if (transformationId) {
        // Usar transformación configurada
        const transformation = getTransformation(transformationId);
        
        if (transformation) {
          try {
            const transformed = transformation.transform(sampleValue);
            displayValue = formatValueForDisplay(transformed);
            transformationName = transformation.name;
          } catch (error) {
            displayValue = `Error: ${(error as Error).message}`;
          }
        }
      } else {
        // No hay transformación seleccionada, mostrar valor sin transformar
        displayValue = 'Requiere transformación';
      }
    } else if (compatibility === CompatibilityStatus.INCOMPATIBLE) {
      displayValue = 'No compatible';
    } else {
      // Es compatible, formatear valor
      displayValue = formatValueForDisplay(sampleValue);
    }
    
    return {
      caseStudyFieldId: caseStudyField.id,
      caseStudyFieldName: caseStudyField.name,
      notionFieldName: notionField.name,
      sampleValue,
      displayValue,
      hasTransformation: compatibility === CompatibilityStatus.REQUIRES_TRANSFORMATION,
      transformationId,
      transformationName
    };
  }).filter(Boolean) as PreviewData[];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-4/5 max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Previsualización de Mapeo</h2>
          <button 
            onClick={onCloseAction}
            className="p-1 rounded hover:bg-gray-200"
            aria-label="Cerrar previsualización"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-gray-600">
                  Esta previsualización muestra cómo se verían los datos mapeados en el Case Study.
                  Los valores son ejemplos generados automáticamente.
                </p>
              </div>
              
              <div className="overflow-hidden border rounded">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Campo de Case Study
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Campo de Notion
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Valor de Ejemplo
                      </th>
                      <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                        Transformación
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.map((data, index) => (
                      <tr key={data.caseStudyFieldId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          {data.caseStudyFieldName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {data.notionFieldName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="max-w-xs overflow-hidden text-ellipsis">
                            {data.displayValue}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {data.hasTransformation ? (
                            data.transformationName ? (
                              <span className="px-2 py-1 text-xs text-amber-800 bg-amber-100 rounded-full">
                                {data.transformationName}
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs text-red-800 bg-red-100 rounded-full">
                                Requiere transformación
                              </span>
                            )
                          ) : (
                            <span className="px-2 py-1 text-xs text-teal-800 bg-teal-100 rounded-full">
                              Compatible
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={onCloseAction}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// Función para generar valores de ejemplo según el tipo de campo
function generateSampleValue(type: string): unknown {
  switch (type) {
    case 'title':
    case 'rich_text':
    case 'text':
      return 'Texto de ejemplo';
    case 'number':
      return 42;
    case 'checkbox':
      return true;
    case 'select':
      return { name: 'Opción 1' };
    case 'multi_select':
      return [{ name: 'Opción 1' }, { name: 'Opción 2' }];
    case 'date':
      return { start: '2023-05-15' };
    case 'files':
      return [
        { name: 'imagen.jpg', url: 'https://example.com/imagen.jpg' },
        { name: 'documento.pdf', url: 'https://example.com/documento.pdf' }
      ];
    case 'url':
      return 'https://example.com';
    case 'email':
      return 'ejemplo@email.com';
    case 'phone_number':
      return '+123456789';
    case 'person':
      return [{ name: 'Usuario Ejemplo' }];
    default:
      return 'Valor no especificado';
  }
}

// Formatear valor para mostrar en la tabla
function formatValueForDisplay(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      if (value.length === 0) return '[]';
      
      // Si son objetos con propiedad name (como multi_select)
      if (typeof value[0] === 'object' && (value[0] as any)?.name) {
        return value.map(item => (item as any).name).join(', ');
      }
      
      return JSON.stringify(value).slice(0, 100) + (JSON.stringify(value).length > 100 ? '...' : '');
    }
    
    // Si es un objeto con propiedad name (como select)
    if ((value as any).name) {
      return (value as any).name;
    }
    
    // Si es un objeto de fecha
    if ((value as any).start) {
      const date = new Date((value as any).start);
      return date.toLocaleDateString('es-ES');
    }
    
    // Si es un objeto de imagen
    if ((value as any).url) {
      return `Imagen: ${(value as any).name || (value as any).url.split('/').pop()}`;
    }
    
    return JSON.stringify(value).slice(0, 100) + (JSON.stringify(value).length > 100 ? '...' : '');
  }
  
  return String(value);
}
