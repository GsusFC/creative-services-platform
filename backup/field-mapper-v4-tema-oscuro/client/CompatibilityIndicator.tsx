'use client';

/**
 * Indicador de Compatibilidad
 * 
 * Componente que muestra visualmente la compatibilidad entre dos tipos de campos
 */

import { CompatibilityStatus } from '@/lib/field-mapper-v4/types';
import { getTransformation } from '@/lib/field-mapper-v4/transformations';

interface CompatibilityIndicatorProps {
  status: CompatibilityStatus;
  transformationId?: string;
  compact?: boolean;
  showLabel?: boolean;
}

export default function CompatibilityIndicator({
  status,
  transformationId,
  compact = false,
  showLabel = true,
}: CompatibilityIndicatorProps) {
  // Definir clases y configuración según el estado
  const config = {
    [CompatibilityStatus.COMPATIBLE]: {
      icon: '✓',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      borderColor: 'border-green-300',
      label: 'Compatible',
      description: 'Los campos son directamente compatibles',
    },
    [CompatibilityStatus.REQUIRES_TRANSFORMATION]: {
      icon: '⚠',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-300',
      label: 'Transformación',
      description: 'Se requiere transformación',
    },
    [CompatibilityStatus.INCOMPATIBLE]: {
      icon: '✕',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      borderColor: 'border-red-300',
      label: 'Incompatible',
      description: 'Los campos no son compatibles',
    },
  };

  const { icon, bgColor, textColor, borderColor, label, description } = config[status];
  
  // Si es compacto, solo mostramos el icono
  if (compact) {
    return (
      <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${bgColor} ${textColor}`}>
        {icon}
      </span>
    );
  }

  // Obtener información de la transformación si existe
  const transformation = transformationId ? getTransformation(transformationId) : null;
  
  return (
    <div
      className={`flex items-center px-2 py-1 rounded ${bgColor} ${textColor} ${borderColor} border`}
    >
      <span className="mr-1 font-bold">{icon}</span>
      {showLabel && <span className="font-medium">{label}</span>}
      
      {transformation && status === CompatibilityStatus.REQUIRES_TRANSFORMATION && (
        <div className="ml-2 text-xs">
          <div>{transformation.name}</div>
          {transformation.performanceImpact === 'high' && (
            <div className="text-red-600">Impacto alto en rendimiento</div>
          )}
        </div>
      )}
    </div>
  );
}
