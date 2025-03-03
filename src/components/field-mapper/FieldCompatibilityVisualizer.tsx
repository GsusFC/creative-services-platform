/**
 * Componente para visualizar la compatibilidad entre campos de Notion y Landing Pages
 * 
 * Este componente proporciona indicadores visuales claros sobre la compatibilidad
 * entre campos de diferentes tipos, mostrando transformaciones y validaciones.
 */

'use client'

import React, { useMemo } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  HelpCircle,
  ArrowRight,
  Info,
  Zap
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  hasTransformation, 
  getTransformationDescription,
  getTransformationExample
} from '@/lib/field-mapper/v3-transformations'
import { 
  ComponentCompatibilityLevel, 
  validateFieldCompatibility 
} from '@/lib/field-mapper/v3-validation'

// Interfaz para propiedades básicas de campo
interface FieldProperties {
  id: string
  name: string
  type: string
  required?: boolean
}

interface FieldCompatibilityVisualizerProps {
  sourceField: FieldProperties | null
  targetField: FieldProperties | null
  sourceName?: string
  targetName?: string
  sourceComponentName?: string
  targetComponentName?: string
  showConnector?: boolean
  onCreateMapping?: () => void
  isCreateDisabled?: boolean
  className?: string
}

/**
 * Componente para visualizar la compatibilidad entre dos campos
 */
const FieldCompatibilityVisualizer = ({
  sourceField,
  targetField,
  sourceName = "Notion",
  targetName = "Landing Page",
  sourceComponentName,
  targetComponentName,
  showConnector = true,
  onCreateMapping,
  isCreateDisabled = false,
  className = ""
}: FieldCompatibilityVisualizerProps) => {
  // Si no hay campos seleccionados, mostrar mensaje
  if (!sourceField && !targetField) {
    return (
      <div className={cn("p-4 bg-gray-900 border border-gray-800 rounded-md text-gray-400", className)}>
        <div className="flex items-center">
          <Info className="w-5 h-5 mr-2" />
          <span>Selecciona campos para visualizar su compatibilidad</span>
        </div>
      </div>
    )
  }

  // Calcular nivel de compatibilidad usando la función de validación del servidor
  const compatibilityResult = useMemo(() => {
    if (!sourceField || !targetField) {
      return { 
        level: ComponentCompatibilityLevel.INFO, 
        message: "Selecciona ambos campos" 
      };
    }

    // Utilizar la función de validación de compatibilidad
    return validateFieldCompatibility(sourceField.type, targetField.type);
  }, [sourceField, targetField]);
  
  // Obtener ejemplo de transformación si aplica
  const transformationExample = useMemo(() => {
    if (!sourceField || !targetField) return null;
    
    if (hasTransformation(sourceField.type, targetField.type)) {
      return getTransformationExample(sourceField.type, targetField.type);
    }
    
    return null;
  }, [sourceField, targetField]);
  
  // Mapear nivel de compatibilidad a un string para facilidad de uso en UI
  const compatibilityLevel = compatibilityResult.level === ComponentCompatibilityLevel.COMPATIBLE 
    ? 'exact' 
    : compatibilityResult.level === ComponentCompatibilityLevel.WARNING 
      ? 'compatible' 
      : compatibilityResult.level === ComponentCompatibilityLevel.ERROR 
        ? 'incompatible' 
        : 'unknown'
  
  // Función para obtener el indicador de compatibilidad según el nivel
  const getCompatibilityIndicator = () => {
    if (!sourceField || !targetField) {
      return (
        <div className="flex flex-col items-center">
          <HelpCircle className="text-gray-400 h-6 w-6" />
          <span className="text-xs text-gray-400 mt-1">Selecciona campos</span>
        </div>
      );
    }

    // Configuración visual según el nivel de compatibilidad
    const { icon, textLabel, textColorClass } = (() => {
      switch (compatibilityResult.level) {
        case ComponentCompatibilityLevel.COMPATIBLE:
          return {
            icon: <CheckCircle className="text-green-500 h-6 w-6" />,
            textLabel: "Compatible",
            textColorClass: "bg-green-900/50 text-green-400",
          };
        case ComponentCompatibilityLevel.WARNING:
          return {
            icon: <AlertTriangle className="text-yellow-500 h-6 w-6" />,
            textLabel: "Transformación",
            textColorClass: "bg-yellow-900/50 text-yellow-400",
          };
        case ComponentCompatibilityLevel.ERROR:
          return {
            icon: <XCircle className="text-red-500 h-6 w-6" />,
            textLabel: "Incompatible",
            textColorClass: "bg-red-900/50 text-red-400",
          };
        default:
          return {
            icon: <HelpCircle className="text-gray-400 h-6 w-6" />,
            textLabel: "Desconocido",
            textColorClass: "bg-gray-900/50 text-gray-400",
          };
      }
    })();

    // Renderizar el indicador
    return (
      <div className="flex flex-col items-center">
        {icon}
        <Badge variant="outline" className={cn("mt-1 border-0 text-xs", textColorClass)}>
          {textLabel}
        </Badge>
      </div>
    );
  };

  // Renderizar campos de origen y destino
  const renderField = (field: FieldProperties | null, label: string, componentName?: string) => {
    if (!field) {
      return (
        <div className="flex flex-col p-3 bg-gray-900 border border-gray-800 rounded-md">
          <div className="text-xs text-gray-400 uppercase mb-1">{label}</div>
          <div className="text-gray-500 italic">Selecciona un campo</div>
        </div>
      );
    }

    return (
      <div className="flex flex-col p-3 bg-gray-900 border border-gray-800 rounded-md">
        <div className="text-xs text-gray-400 uppercase mb-1">{label}</div>
        {componentName && (
          <div className="text-xs text-gray-500 mb-1">{componentName}</div>
        )}
        <div className="font-medium">{field.name}</div>
        <Badge variant="outline" className="mt-1 self-start border-gray-700 text-gray-400">
          {field.type}
        </Badge>
        {field.required && (
          <Badge variant="outline" className="mt-1 ml-1 self-start border-gray-700 bg-amber-950/30 text-amber-400">
            requerido
          </Badge>
        )}
      </div>
    );
  };

  // Componente principal
  return (
    <div className={cn("p-4 bg-gray-950 border border-gray-800 rounded-lg", className)}>
      {/* Título */}
      <h3 className="text-md font-medium mb-4 flex items-center">
        <Zap className="w-4 h-4 mr-2 text-yellow-400" />
        Compatibilidad de Campos
      </h3>
      
      {/* Contenedor de campos e indicador */}
      <div className="flex items-center gap-2">
        {/* Campo origen */}
        <div className="flex-1">
          {renderField(sourceField, sourceName, sourceComponentName)}
        </div>
        
        {/* Indicador de compatibilidad */}
        {showConnector && (
          <div className="flex flex-col items-center px-1">
            {getCompatibilityIndicator()}
          </div>
        )}
        
        {/* Campo destino */}
        <div className="flex-1">
          {renderField(targetField, targetName, targetComponentName)}
        </div>
      </div>
      
      {/* Mensaje de compatibilidad */}
      {sourceField && targetField && (
        <div className={cn(
          "mt-3 p-2 rounded text-sm",
          compatibilityLevel === 'exact' ? "bg-green-950/30 text-green-400" :
          compatibilityLevel === 'compatible' ? "bg-yellow-950/30 text-yellow-400" :
          compatibilityLevel === 'incompatible' ? "bg-red-950/30 text-red-400" :
          "bg-gray-950 text-gray-400"
        )}>
          {compatibilityResult.message}
        </div>
      )}
      
      {/* Ejemplo de transformación si existe */}
      {transformationExample && compatibilityLevel === 'compatible' && (
        <div className="mt-3 p-2 rounded bg-yellow-950/20 border border-yellow-900/50">
          <p className="text-xs text-yellow-400 mb-1">Ejemplo de transformación:</p>
          <div className="flex text-xs gap-2">
            <div className="flex-1 p-1 bg-gray-900 rounded">
              <p className="text-gray-400 mb-1">Antes:</p>
              <pre className="text-white text-xs overflow-x-auto">{transformationExample.before}</pre>
            </div>
            <div className="flex items-center">
              <ArrowRight className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="flex-1 p-1 bg-gray-900 rounded">
              <p className="text-gray-400 mb-1">Después:</p>
              <pre className="text-white text-xs overflow-x-auto">{transformationExample.after}</pre>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <Badge variant="outline" className={cn(
              "text-xs border-0",
              transformationExample.performanceImpact === 'bajo' ? "bg-green-900/20 text-green-400" :
              transformationExample.performanceImpact === 'medio' ? "bg-yellow-900/20 text-yellow-400" :
              "bg-red-900/20 text-red-400"
            )}>
              Impacto: {transformationExample.performanceImpact}
            </Badge>
          </div>
        </div>
      )}
      
      {/* Botón para crear mapeo */}
      {onCreateMapping && sourceField && targetField && (
        <button
          onClick={onCreateMapping}
          disabled={isCreateDisabled || compatibilityLevel === 'incompatible'}
          className={cn(
            "w-full mt-3 py-2 px-4 rounded-md text-sm font-medium transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-900 focus:ring-blue-500",
            isCreateDisabled || compatibilityLevel === 'incompatible'
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          )}
          aria-label="Crear mapeo entre campos"
        >
          Crear Mapeo
        </button>
      )}
    </div>
  )
}

export default FieldCompatibilityVisualizer
