'use client';

/**
 * Panel de Resumen
 * 
 * Muestra un resumen del estado de los mapeos y proporciona
 * controles para guardar, previsualizar o reiniciar la configuración
 */

import { useMemo } from 'react';
import { CaseStudyField, FieldMapping, CompatibilityStatus, NotionField } from '@/lib/field-mapper-v4/types';
import { checkFieldCompatibility } from '@/lib/field-mapper-v4/validation';
import CompatibilityIndicator from './CompatibilityIndicator';

interface SummaryPanelProps {
  caseStudyFields: CaseStudyField[];
  notionFields: NotionField[];
  mappings: FieldMapping[];
  onSave: () => void;
  onReset: () => void;
}

export default function SummaryPanel({
  caseStudyFields,
  notionFields,
  mappings,
  onSave,
  onReset,
}: SummaryPanelProps) {
  // Calcular estadísticas
  const totalFields = caseStudyFields.length;
  const mappedFields = mappings.length;
  const mappedRequiredFields = caseStudyFields
    .filter(field => field.required)
    .filter(field => mappings.some(mapping => mapping.caseStudyFieldId === field.id))
    .length;
  const totalRequiredFields = caseStudyFields.filter(field => field.required).length;
  const missingRequiredFields = totalRequiredFields - mappedRequiredFields;
  
  // Calcular porcentaje de progreso
  const progressPercentage = totalFields > 0 ? Math.round((mappedFields / totalFields) * 100) : 0;
  
  // Obtener campos pendientes
  const pendingFields = caseStudyFields.filter(
    field => !mappings.some(mapping => mapping.caseStudyFieldId === field.id)
  );
  
  // Verificar si la configuración está lista para guardar
  const isConfigReady = missingRequiredFields === 0;

  // Calcular estadísticas de compatibilidad
  const compatibilityStats = useMemo(() => {
    const stats = {
      [CompatibilityStatus.COMPATIBLE]: 0,
      [CompatibilityStatus.REQUIRES_TRANSFORMATION]: 0,
      [CompatibilityStatus.INCOMPATIBLE]: 0,
    };
    
    mappings.forEach(mapping => {
      const notionField = notionFields.find(f => f.id === mapping.notionFieldId);
      const caseStudyField = caseStudyFields.find(f => f.id === mapping.caseStudyFieldId);
      
      if (notionField && caseStudyField) {
        const compatibility = checkFieldCompatibility(notionField, caseStudyField);
        stats[compatibility.status]++;
      }
    });
    
    return stats;
  }, [mappings, notionFields, caseStudyFields]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="mb-4 text-lg font-semibold text-white">Resumen de Mapeos</h2>
      
      {/* Progreso de mapeo */}
      <div className="p-4 mb-4 bg-gray-800 border border-gray-700 rounded">
        <h3 className="mb-2 text-base font-medium text-white">Progreso de mapeo:</h3>
        
        <div className="w-full h-2 mb-2 bg-gray-700 rounded-full">
          <div
            className="h-2 bg-blue-600 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <div className="text-sm text-gray-300">
          <span className="font-medium">{mappedFields} de {totalFields}</span> campos mapeados ({progressPercentage}%)
        </div>
        
        {/* Estado de campos requeridos */}
        <div className="mt-2 text-sm text-gray-300">
          <span className="font-medium">{mappedRequiredFields} de {totalRequiredFields}</span> campos requeridos mapeados
          
          {missingRequiredFields > 0 && (
            <div className="mt-1 text-red-400">
              <span className="font-medium">{missingRequiredFields}</span> campos requeridos pendientes
            </div>
          )}
        </div>
      </div>
      
      {/* Estadísticas de compatibilidad */}
      {mappedFields > 0 && (
        <div className="p-4 mb-4 bg-gray-800 border border-gray-700 rounded">
          <h3 className="mb-3 text-base font-medium text-white">Compatibilidad:</h3>
          
          <div className="space-y-2 text-gray-300">
            {compatibilityStats[CompatibilityStatus.COMPATIBLE] > 0 && (
              <div className="flex items-center">
                <CompatibilityIndicator 
                  status={CompatibilityStatus.COMPATIBLE} 
                  compact={true} 
                />
                <span className="ml-2">
                  <span className="font-medium">{compatibilityStats[CompatibilityStatus.COMPATIBLE]}</span> Campos compatibles
                </span>
              </div>
            )}
            
            {compatibilityStats[CompatibilityStatus.REQUIRES_TRANSFORMATION] > 0 && (
              <div className="flex items-center">
                <CompatibilityIndicator 
                  status={CompatibilityStatus.REQUIRES_TRANSFORMATION} 
                  compact={true} 
                />
                <span className="ml-2">
                  <span className="font-medium">{compatibilityStats[CompatibilityStatus.REQUIRES_TRANSFORMATION]}</span> Campos con transformación
                </span>
              </div>
            )}
            
            {compatibilityStats[CompatibilityStatus.INCOMPATIBLE] > 0 && (
              <div className="flex items-center">
                <CompatibilityIndicator 
                  status={CompatibilityStatus.INCOMPATIBLE} 
                  compact={true} 
                />
                <span className="ml-2">
                  <span className="font-medium">{compatibilityStats[CompatibilityStatus.INCOMPATIBLE]}</span> Campos incompatibles
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Campos pendientes */}
      {pendingFields.length > 0 && (
        <div className="p-4 mb-4 bg-gray-800 border border-gray-700 rounded">
          <h3 className="mb-2 text-base font-medium text-white">
            Campos pendientes {pendingFields.length > 0 && `(${pendingFields.length})`}:
          </h3>
          
          <div className="max-h-60 overflow-y-auto">
            <ul className="space-y-1">
              {pendingFields.map(field => (
                <li key={field.id} className="flex items-center text-sm">
                  <span className={`w-2 h-2 mr-2 rounded-full ${field.required ? 'bg-red-500' : 'bg-gray-500'}`}></span>
                  <span className={field.required ? 'font-medium text-red-400' : 'text-gray-400'}>
                    {field.name}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">({field.type})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      {/* Acciones */}
      <div className="p-4 mt-auto bg-gray-800 border border-gray-700 rounded">
        <div className="flex flex-col space-y-2">
          <button 
            onClick={onSave} 
            disabled={!isConfigReady}
            className="w-full py-2 font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar configuración
          </button>
          
          <button 
            onClick={onReset}
            className="w-full py-2 font-medium text-white bg-red-600 rounded hover:bg-red-700"
          >
            Reiniciar mapeos
          </button>
        </div>
        
        {!isConfigReady && (
          <div className="mt-3 text-sm text-center text-red-400">
            Debes mapear todos los campos requeridos antes de guardar.
          </div>
        )}
      </div>
    </div>
  );
}
