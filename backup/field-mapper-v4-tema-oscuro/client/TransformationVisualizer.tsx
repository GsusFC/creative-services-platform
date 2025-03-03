'use client';

/**
 * Visualizador de Transformaciones
 * 
 * Componente para mostrar visualmente el proceso de transformación
 * entre dos tipos de campos diferentes
 */

import { useState, useEffect } from 'react';
import { FieldType } from '@/lib/field-mapper-v4/types';
import { useTransformations } from '@/lib/field-mapper-v4/hooks';
import { formatFieldType } from '@/lib/field-mapper-v4/utils';
import { getTransformation } from '@/lib/field-mapper-v4/transformations';

interface TransformationVisualizerProps {
  sourceType: FieldType;
  targetType: FieldType;
  transformationId: string;
  showLabels?: boolean;
  className?: string;
}

export default function TransformationVisualizer({
  sourceType,
  targetType,
  transformationId,
  showLabels = true,
  className = '',
}: TransformationVisualizerProps) {
  const { generateSampleValue, formatTransformedValue, tryTransformation } = useTransformations();
  const [sourceValue, setSourceValue] = useState<any>(null);
  const [targetValue, setTargetValue] = useState<any>(null);
  const [transformation, setTransformation] = useState<any>(null);
  
  // Inicializar con valores de ejemplo
  useEffect(() => {
    const newSourceValue = generateSampleValue(sourceType);
    setSourceValue(newSourceValue);
    
    const trans = getTransformation(transformationId);
    setTransformation(trans);
    
    if (trans) {
      const newTargetValue = tryTransformation(
        sourceType,
        targetType,
        transformationId,
        newSourceValue
      );
      setTargetValue(newTargetValue);
    }
  }, [sourceType, targetType, transformationId, generateSampleValue, tryTransformation]);

  if (!transformation) {
    return (
      <div className="p-4 text-gray-500 text-sm italic">
        No se encontró la transformación
      </div>
    );
  }

  return (
    <div className={`p-4 ${className}`}>
      <div className="flex flex-col space-y-4">
        {/* Diagrama de transformación */}
        <div className="flex items-center justify-between">
          {/* Valor origen */}
          <div className="w-2/5">
            {showLabels && (
              <div className="text-xs text-gray-500 mb-1">
                {formatFieldType(sourceType)}
              </div>
            )}
            <div className="p-3 bg-gray-100 rounded text-sm overflow-hidden">
              {formatTransformedValue(sourceValue)}
            </div>
          </div>
          
          {/* Flecha de transformación */}
          <div className="flex-1 flex justify-center items-center">
            <div className="h-0.5 w-full bg-amber-500 relative">
              <div className="absolute -top-2 right-0 h-5 w-5 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 text-amber-500" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Valor destino */}
          <div className="w-2/5">
            {showLabels && (
              <div className="text-xs text-gray-500 mb-1">
                {formatFieldType(targetType)}
              </div>
            )}
            <div className="p-3 bg-blue-100 rounded text-sm overflow-hidden">
              {formatTransformedValue(targetValue)}
            </div>
          </div>
        </div>
        
        {/* Detalles de la transformación */}
        <div className="mt-2 text-xs text-gray-600">
          <div className="font-medium">{transformation.name}</div>
          <div className="mt-1 text-gray-500">{transformation.description}</div>
        </div>
      </div>
    </div>
  );
}
