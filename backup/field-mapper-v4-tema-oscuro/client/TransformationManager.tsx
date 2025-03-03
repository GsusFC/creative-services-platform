'use client';

/**
 * Gestor de Transformaciones
 * 
 * Componente que permite visualizar, probar y configurar transformaciones
 * entre diferentes tipos de campos
 */

import { useState, useEffect } from 'react';
import { FieldType, CompatibilityStatus } from '@/lib/field-mapper-v4/types';
import { Transformation, transformations, applyTransformation } from '@/lib/field-mapper-v4/transformations';
import CompatibilityIndicator from './CompatibilityIndicator';

interface TransformationManagerProps {
  sourceType: FieldType;
  targetType: FieldType;
  onClose: () => void;
  onApplyTransformation?: (transformationId: string) => void;
}

export default function TransformationManager({
  sourceType,
  targetType,
  onClose,
  onApplyTransformation,
}: TransformationManagerProps) {
  // Estados
  const [availableTransformations, setAvailableTransformations] = useState<Transformation[]>([]);
  const [selectedTransformation, setSelectedTransformation] = useState<Transformation | null>(null);
  const [sampleInput, setSampleInput] = useState<string>('');
  const [transformationResult, setTransformationResult] = useState<string>('');
  const [options, setOptions] = useState<Record<string, any>>({});
  
  // Cargar transformaciones disponibles
  useEffect(() => {
    const filtered = transformations.filter(
      t => t.sourceType === sourceType && t.targetType === targetType
    );
    
    setAvailableTransformations(filtered);
    
    if (filtered.length > 0) {
      setSelectedTransformation(filtered[0]);
      
      // Establecer muestra inicial basada en el ejemplo
      if (filtered[0].example?.source) {
        setSampleInput(
          typeof filtered[0].example.source === 'object'
            ? JSON.stringify(filtered[0].example.source, null, 2)
            : String(filtered[0].example.source)
        );
      }
    }
  }, [sourceType, targetType]);
  
  // Actualizar resultado cuando cambia la entrada o la transformación
  useEffect(() => {
    if (!selectedTransformation || !sampleInput) return;
    
    try {
      // Intentar parsear la entrada como JSON si es posible
      let parsedInput;
      try {
        parsedInput = JSON.parse(sampleInput);
      } catch {
        parsedInput = sampleInput;
      }
      
      // Aplicar la transformación
      const result = selectedTransformation.transform(parsedInput, options);
      
      // Convertir el resultado a string para mostrar
      setTransformationResult(
        typeof result === 'object'
          ? JSON.stringify(result, null, 2)
          : String(result)
      );
    } catch (error) {
      setTransformationResult(`Error: ${(error as Error).message}`);
    }
  }, [selectedTransformation, sampleInput, options]);
  
  // Manejar cambio de transformación
  const handleTransformationChange = (transformationId: string) => {
    const transformation = availableTransformations.find(t => t.id === transformationId);
    if (transformation) {
      setSelectedTransformation(transformation);
      
      // Actualizar muestra con el ejemplo
      if (transformation.example?.source) {
        setSampleInput(
          typeof transformation.example.source === 'object'
            ? JSON.stringify(transformation.example.source, null, 2)
            : String(transformation.example.source)
        );
      }
    }
  };
  
  // Manejar aplicación de transformación
  const handleApply = () => {
    if (selectedTransformation && onApplyTransformation) {
      onApplyTransformation(selectedTransformation.id);
    }
    onClose();
  };
  
  // Renderizar opciones de configuración según el tipo de transformación
  const renderOptions = () => {
    if (!selectedTransformation) return null;
    
    // Opciones según el tipo de transformación
    switch (selectedTransformation.id) {
      case 'multi_select_to_text':
        return (
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Separador:
            </label>
            <input
              type="text"
              value={options.separator || ', '}
              onChange={(e) => setOptions({ ...options, separator: e.target.value })}
              className="w-24 px-3 py-2 border rounded"
            />
          </div>
        );
      
      case 'date_to_text':
        return (
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Formato de fecha:
            </label>
            <select
              value={options.format || 'DD/MM/YYYY'}
              onChange={(e) => setOptions({ ...options, format: e.target.value })}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              <option value="DD MMMM YYYY">DD MMMM YYYY</option>
              <option value="MMMM DD, YYYY">MMMM DD, YYYY</option>
            </select>
          </div>
        );
        
      case 'files_to_image':
        return (
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">
              Índice de imagen:
            </label>
            <input
              type="number"
              min="0"
              value={options.index || 0}
              onChange={(e) => setOptions({ ...options, index: Number(e.target.value) })}
              className="w-24 px-3 py-2 border rounded"
            />
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-4/5 max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Configuración de Transformación</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-200"
            aria-label="Cerrar configuración"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-auto">
          {availableTransformations.length > 0 ? (
            <>
              <div className="mb-4">
                <h3 className="mb-2 text-base font-medium">
                  Transformación de {sourceType} a {targetType}
                </h3>
                
                <div className="p-3 bg-gray-50 border rounded">
                  <div className="flex items-center mb-3">
                    <div className="w-1/3 font-medium">{sourceType}</div>
                    <div className="w-1/3 text-center">
                      <div className="inline-block px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                        Transformación
                      </div>
                    </div>
                    <div className="w-1/3 text-right font-medium">{targetType}</div>
                  </div>
                  
                  <div className="flex items-center">
                    <CompatibilityIndicator status={CompatibilityStatus.REQUIRES_TRANSFORMATION} />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">
                      Tipo de transformación:
                    </label>
                    <select
                      value={selectedTransformation?.id || ''}
                      onChange={(e) => handleTransformationChange(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                    >
                      {availableTransformations.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({getPerformanceLabel(t.performanceImpact)})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedTransformation && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600">
                        {selectedTransformation.description}
                      </div>
                      
                      <div className="mt-2 flex items-center">
                        <span className="text-sm font-medium mr-2">
                          Impacto en rendimiento:
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPerformanceColor(selectedTransformation.performanceImpact)}`}>
                          {getPerformanceLabel(selectedTransformation.performanceImpact)}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Opciones de configuración */}
                  {renderOptions()}
                </div>
                
                <div>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium">
                      Probar transformación:
                    </label>
                    
                    <div className="space-y-2">
                      <div>
                        <div className="mb-1 text-xs text-gray-500">Entrada ({sourceType}):</div>
                        <textarea
                          value={sampleInput}
                          onChange={(e) => setSampleInput(e.target.value)}
                          className="w-full h-32 p-2 font-mono text-sm border rounded"
                          placeholder={`Ingresa una muestra de ${sourceType}...`}
                        />
                      </div>
                      
                      <div>
                        <div className="mb-1 text-xs text-gray-500">Resultado ({targetType}):</div>
                        <div className="w-full h-32 p-2 font-mono text-sm bg-gray-50 border rounded overflow-auto">
                          {transformationResult || '(Sin resultado)'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              No hay transformaciones disponibles entre {sourceType} y {targetType}.
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          
          {availableTransformations.length > 0 && (
            <button
              onClick={handleApply}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Aplicar Transformación
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Obtener etiqueta de rendimiento
function getPerformanceLabel(impact: 'low' | 'medium' | 'high'): string {
  const labels = {
    low: 'Bajo',
    medium: 'Medio',
    high: 'Alto'
  };
  return labels[impact];
}

// Obtener color para indicador de rendimiento
function getPerformanceColor(impact: 'low' | 'medium' | 'high'): string {
  const colors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };
  return colors[impact];
}
