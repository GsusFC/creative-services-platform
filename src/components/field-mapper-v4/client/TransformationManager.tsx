'use client';

/**
 * Gestor de Transformaciones
 * 
 * Componente que permite visualizar, probar y configurar transformaciones
 * entre diferentes tipos de campos
 */

import { useState, useEffect, useCallback } from 'react';
import { FieldType, CompatibilityStatus } from '@/lib/field-mapper-v4/types';
import { Transformation, transformations } from '@/lib/field-mapper-v4/transformations';
import CompatibilityIndicator from './CompatibilityIndicator';

interface TransformationManagerProps {
  sourceType: FieldType;
  targetType: FieldType;
  onCloseAction: () => void;
  onApplyTransformationAction?: (transformationId: string) => void;
}

export default function TransformationManager({
  sourceType,
  targetType,
  onCloseAction,
  onApplyTransformationAction,
}: TransformationManagerProps) {
  // Estados
  const [availableTransformations, setAvailableTransformations] = useState<Transformation[]>([]);
  const [selectedTransformation, setSelectedTransformation] = useState<Transformation | null>(null);
  const [sampleInput, setSampleInput] = useState<string>('');
  const [transformationResult, setTransformationResult] = useState<string>('');
  const [options, setOptions] = useState<Record<string, unknown>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  
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
  
  // Función para procesar la transformación (extraída para evitar duplicación)
  const processTransformation = useCallback(() => {
    if (!selectedTransformation || !sampleInput) {
      setTransformationResult('');
      return;
    }
    
    setIsProcessing(true);
    
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
        result !== null && typeof result === 'object'
          ? JSON.stringify(result, null, 2)
          : String(result)
      );
    } catch (error) {
      setTransformationResult(`Error: ${(error as Error).message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [selectedTransformation, sampleInput, options]);
  
  // Actualizar resultado cuando cambia la entrada o la transformación
  useEffect(() => {
    processTransformation();
  }, [processTransformation]);
  
  // Manejar cambio de transformación
  const handleTransformationChange = useCallback((transformationId: string) => {
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
  }, [availableTransformations]);
  
  // Manejar aplicación de transformación
  const handleApply = () => {
    if (selectedTransformation && onApplyTransformationAction) {
      onApplyTransformationAction(selectedTransformation.id);
    }
    onCloseAction();
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
              value={options.separator as string || ', '}
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
              value={options.format as string || 'DD/MM/YYYY'}
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
              value={options.index as number || 0}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-4/5 max-w-4xl p-6 mx-auto bg-black/60 border border-white/10 rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col text-white/90">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-teal-400 font-mono flex items-center gap-2">
            Configuración de Transformación
          </h2>
          <button 
            onClick={onCloseAction}
            className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white/90 transition-colors"
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
                
                <div className="p-4 bg-black/40 border border-white/10 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="w-1/3 font-medium">{sourceType}</div>
                    <div className="w-1/3 text-center">
                      <div className="inline-block px-3 py-1 text-sm font-medium text-teal-400 bg-teal-500/20 rounded">
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
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white/90 focus:border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
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
                        <span className={`px-1.5 py-0.5 text-xs rounded font-mono ${getPerformanceColor(selectedTransformation.performanceImpact)}`}>
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
                          className="w-full h-32 p-3 font-mono text-sm bg-black/40 border border-white/10 rounded-lg text-white/90 focus:border-teal-500/50 focus:outline-none focus:ring-1 focus:ring-teal-500/30"
                          placeholder={`Ingresa una muestra de ${sourceType}...`}
                        />
                      </div>
                                            <button
                        onClick={processTransformation}
                        disabled={isProcessing || !selectedTransformation}
                        className={`mb-2 px-3 py-1.5 text-teal-400 bg-teal-500/20 rounded hover:bg-teal-500/30 transition-colors text-sm font-medium ${
                          isProcessing ? 'opacity-50 cursor-wait' : ''
                        }`}
                      >
                        Probar Transformación
                      </button>
                      
                      <div>
                        <div className="mb-1 text-xs text-gray-500">Resultado ({targetType}):</div>
                        <div className="w-full h-32 p-3 font-mono text-sm bg-black/20 border border-white/10 rounded-lg overflow-auto">
                          {transformationResult || '(Sin resultado)'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-white/60 font-mono border border-white/10 rounded-lg bg-black/40">
              No hay transformaciones disponibles entre {sourceType} y {targetType}.
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onCloseAction}
            className="px-4 py-2 text-white/70 bg-white/10 rounded-lg hover:bg-white/20 transition-colors border border-white/10"
          >
            Cancelar
          </button>
          
          {availableTransformations.length > 0 && (
            <button
              onClick={handleApply}
              className="px-4 py-2 text-teal-400 bg-teal-500/20 rounded-lg hover:bg-teal-500/30 transition-colors font-medium"
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
    low: 'bg-teal-500/20 text-teal-400',
    medium: 'bg-amber-500/20 text-amber-400',
    high: 'bg-red-500/20 text-red-400'
  };
  return colors[impact];
}
