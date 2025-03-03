'use client';

/**
 * Indicador de Compatibilidad
 * 
 * Componente que muestra visualmente la compatibilidad entre dos tipos de campos
 * con información detallada sobre los tipos y posibles transformaciones
 */

import { CompatibilityStatus, FieldType } from '@/lib/field-mapper-v4/types';
import { getTransformation } from '@/lib/field-mapper-v4/transformations';
import { useState, useRef } from 'react';

interface CompatibilityIndicatorProps {
  status: CompatibilityStatus;
  transformationId?: string;
  compact?: boolean;
  showLabel?: boolean;
  notionType?: FieldType;
  caseStudyType?: FieldType;
}

export default function CompatibilityIndicator({
  status,
  transformationId,
  compact = false,
  showLabel = true,
  notionType,
  caseStudyType,
}: CompatibilityIndicatorProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Definir clases y configuración según el estado
  const config = {
    [CompatibilityStatus.COMPATIBLE]: {
      icon: '✓',
      label: 'Compatible',
      description: 'Los campos son directamente compatibles',
    },
    [CompatibilityStatus.REQUIRES_TRANSFORMATION]: {
      icon: '⚠',
      label: 'Transformación',
      description: 'Se requiere transformación',
    },
    [CompatibilityStatus.INCOMPATIBLE]: {
      icon: '✕',
      label: 'Incompatible',
      description: 'Los campos no son compatibles',
    },
  };

  // Validar que el estado sea uno de los esperados
  const validStatus = Object.values(CompatibilityStatus).includes(status) 
    ? status 
    : CompatibilityStatus.INCOMPATIBLE;
  
  const { icon, label, description } = config[validStatus];
  
  // Obtener información de la transformación si existe
  const transformation = transformationId ? getTransformation(transformationId) : null;
  
  // Generar descripción detallada con información de tipos
  const getDetailedDescription = () => {
    if (!notionType || !caseStudyType) return description;
    
    if (validStatus === CompatibilityStatus.COMPATIBLE) {
      return `Campo Notion (${notionType}) es directamente compatible con campo Case Study (${caseStudyType})`;
    } else if (validStatus === CompatibilityStatus.REQUIRES_TRANSFORMATION) {
      return `Se necesita transformar de ${notionType} a ${caseStudyType}`;
    } else {
      return `No es posible convertir ${notionType} a ${caseStudyType}`;
    }
  };
  
  const handleMouseEnter = () => setShowTooltip(true);
  const handleMouseLeave = () => setShowTooltip(false);
  
  // Si es compacto, solo mostramos el icono
  if (compact) {
    return (
      <span 
        className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${status === CompatibilityStatus.COMPATIBLE ? 'text-teal-400 bg-teal-900/20' : status === CompatibilityStatus.REQUIRES_TRANSFORMATION ? 'text-amber-400 bg-amber-900/20' : 'text-red-400 bg-red-900/20'} cursor-help`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        tabIndex={0}
        role="status"
        aria-label={`Estado de compatibilidad: ${label}`}
        onKeyDown={(e) => e.key === 'Enter' && setShowTooltip(!showTooltip)}
      >
        {icon}
        {showTooltip && (
          <div className="absolute z-50 p-2 text-xs bg-gray-800 text-white rounded shadow-lg mt-1 w-48">
            <p className="font-medium">{label}</p>
            <p>{getDetailedDescription()}</p>
          </div>
        )}
      </span>
    );
  }

  return (
    <div 
      className={`
        inline-flex items-center ${compact ? 'text-xs' : 'text-sm'}
        ${compact ? 'py-0.5 px-1' : 'p-1.5'} 
        ${compact ? '' : 'rounded'} 
        ${status === CompatibilityStatus.COMPATIBLE 
          ? 'text-teal-400 bg-teal-900/20' 
          : status === CompatibilityStatus.REQUIRES_TRANSFORMATION 
            ? 'text-amber-400 bg-amber-900/20' 
            : 'text-red-400 bg-red-900/20'}
      `}
      ref={tooltipRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="mr-1 font-bold">{icon}</span>
      {showLabel && <span className="font-medium">{label}</span>}
      
      {transformation && validStatus === CompatibilityStatus.REQUIRES_TRANSFORMATION && (
        <div className="ml-2 text-xs">
          <div className="font-medium">{transformation.name}</div>
          <div className="opacity-75">{transformation.description}</div>
        </div>
      )}
      
      {showTooltip && !compact && notionType && caseStudyType && (
        <div className="absolute bottom-full left-0 z-50 p-2 mb-1 text-xs bg-gray-800 text-white rounded shadow-lg w-64 border border-gray-700">
          <p className="font-bold mb-1">{label}</p>
          <p className="mb-1">{getDetailedDescription()}</p>
          {transformation && (
            <div className="mt-1 pt-1 border-t border-gray-700">
              <p className="font-medium">Impacto: {transformation.performanceImpact === 'low' ? 'Bajo' : transformation.performanceImpact === 'medium' ? 'Medio' : 'Alto'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
