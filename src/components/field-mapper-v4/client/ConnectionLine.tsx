'use client';

/**
 * Línea de Conexión
 * 
 * Componente visual que representa la conexión entre un campo de Notion
 * y un campo de Case Study
 */

import { useState } from 'react';
import { CompatibilityStatus, FieldType } from '@/lib/field-mapper-v4/types';
import TransformationManager from './TransformationManager';

interface ConnectionLineProps {
  status: CompatibilityStatus;
  animated?: boolean;
  dashed?: boolean;
  sourceType?: FieldType;
  targetType?: FieldType;
  onApplyTransformation?: (transformationId: string) => void;
}

export default function ConnectionLine({
  status,
  animated = false,
  dashed = false,
  sourceType,
  targetType,
  onApplyTransformation,
}: ConnectionLineProps) {
  const [showTransformationManager, setShowTransformationManager] = useState(false);
  
  // Configuración según estado de compatibilidad
  const colors = {
    [CompatibilityStatus.COMPATIBLE]: 'bg-green-500',
    [CompatibilityStatus.REQUIRES_TRANSFORMATION]: 'bg-yellow-500',
    [CompatibilityStatus.INCOMPATIBLE]: 'bg-red-500',
  };
  
  // Determinar clases según propiedades
  const baseClasses = `h-0.5 w-full ${colors[status]}`;
  const animationClass = animated ? 'animate-pulse' : '';
  const dashedClass = dashed ? 'border-dashed border-2 border-spacing-2' : '';
  
  // Manejo de clic para activar el gestor de transformaciones
  const handleClick = () => {
    if (status === CompatibilityStatus.REQUIRES_TRANSFORMATION && sourceType && targetType) {
      setShowTransformationManager(true);
    }
  };
  
  // Manejo de tecla para accesibilidad
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  };
  
  // Determinar si la conexión es interactiva
  const isInteractive = status === CompatibilityStatus.REQUIRES_TRANSFORMATION && sourceType && targetType;
  
  return (
    <>
      <div 
        className={`flex items-center justify-center w-full py-1 ${isInteractive ? 'cursor-pointer group' : ''}`}
        onClick={isInteractive ? handleClick : undefined}
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? 'button' : undefined}
        aria-label={isInteractive ? 'Configurar transformación' : undefined}
      >
        <div className={`${baseClasses} ${animationClass} ${dashedClass}`}></div>
        
        {isInteractive && (
          <div className="absolute opacity-0 group-hover:opacity-100 bg-white border shadow-md rounded-md px-2 py-1 text-xs text-gray-800 transition-opacity duration-200">
            Configurar transformación
          </div>
        )}
      </div>
      
      {showTransformationManager && sourceType && targetType && (
        <TransformationManager
          sourceType={sourceType}
          targetType={targetType}
          onClose={() => setShowTransformationManager(false)}
          onApplyTransformation={onApplyTransformation}
        />
      )}
    </>
  );
}
