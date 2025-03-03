'use client';

/**
 * Componente para mostrar recomendaciones de optimización basadas en el análisis de rendimiento
 */

import React, { useMemo } from 'react';
import { 
  PerformanceSummary, 
  Issue, 
  FieldMapperConfig 
} from '@/lib/field-mapper/types';
import { formatTime, formatBytes, formatPercentage } from '@/lib/field-mapper/utils';

interface OptimizationRecommendationsProps {
  performanceSummary: PerformanceSummary;
  issues: Issue[];
  config: FieldMapperConfig;
  onConfigChange: (newConfig: Partial<FieldMapperConfig>) => void;
}

export default function OptimizationRecommendations({
  performanceSummary,
  issues,
  config,
  onConfigChange
}: OptimizationRecommendationsProps) {
  // Generar recomendaciones basadas en el rendimiento actual
  const recommendations = useMemo(() => {
    const result: Array<{
      id: string;
      title: string;
      description: string;
      action?: {
        label: string;
        onClick: () => void;
      };
      severity: 'critical' | 'warning' | 'info';
    }> = [];
    
    // Recomendaciones basadas en la caché
    if (performanceSummary.hitRate < 0.5 && !config.cacheEnabled) {
      result?.push({
        id: 'enable-cache',
        title: 'Habilitar caché',
        description: 'La tasa de aciertos de caché es baja. Habilitar la caché puede mejorar significativamente el rendimiento de validación.',
        action: {
          label: 'Habilitar caché',
          onClick: () => onConfigChange({ cacheEnabled: true })
        },
        severity: 'warning'
      });
    }
    
    // Recomendaciones basadas en el tiempo de validación
    if (performanceSummary.averageTime > 100 && !config.workerEnabled) {
      result?.push({
        id: 'enable-worker',
        title: 'Habilitar Web Worker',
        description: `El tiempo promedio de validación es ${formatTime(performanceSummary.averageTime)}. Habilitar el Web Worker puede evitar bloqueos en la interfaz de usuario.`,
        action: {
          label: 'Habilitar Web Worker',
          onClick: () => onConfigChange({ workerEnabled: true })
        },
        severity: performanceSummary.averageTime > 200 ? 'critical' : 'warning'
      });
    }
    
    // Recomendaciones basadas en el uso de memoria
    if (performanceSummary.trend === 'increasing' && performanceSummary.current > 50 * 1024 * 1024) {
      result?.push({
        id: 'reduce-memory',
        title: 'Alto uso de memoria',
        description: `El uso de memoria es ${formatBytes(performanceSummary.current)} y está aumentando. Considere reducir el tamaño máximo de la caché.`,
        action: config.cacheMaxSize > 100 ? {
          label: 'Reducir tamaño de caché',
          onClick: () => onConfigChange({ cacheMaxSize: Math.max(50, config.cacheMaxSize / 2) })
        } : undefined,
        severity: 'warning'
      });
    }
    
    // Recomendaciones basadas en el tiempo de renderizado
    if (performanceSummary.averageTime > 50 && !config.virtualizationEnabled) {
      result?.push({
        id: 'enable-virtualization',
        title: 'Habilitar virtualización',
        description: `El tiempo promedio de renderizado es ${formatTime(performanceSummary.averageTime)}. Habilitar la virtualización puede mejorar el rendimiento con grandes conjuntos de datos.`,
        action: {
          label: 'Habilitar virtualización',
          onClick: () => onConfigChange({ virtualizationEnabled: true })
        },
        severity: performanceSummary.averageTime > 100 ? 'critical' : 'warning'
      });
    }
    
    // Recomendaciones basadas en el tiempo de respuesta de la API
    if (performanceSummary.averageTime > 1000) {
      result?.push({
        id: 'api-timeout',
        title: 'Tiempo de respuesta de API alto',
        description: `El tiempo promedio de respuesta de la API es ${formatTime(performanceSummary.averageTime)}. Considere aumentar el tiempo de espera de la API.`,
        action: config.apiTimeout < 10000 ? {
          label: 'Aumentar timeout',
          onClick: () => onConfigChange({ apiTimeout: config.apiTimeout + 5000 })
        } : undefined,
        severity: performanceSummary.averageTime > 3000 ? 'critical' : 'warning'
      });
    }
    
    // Recomendaciones basadas en la tasa de errores de la API
    if (performanceSummary.errorRate > 0.1) {
      result?.push({
        id: 'api-errors',
        title: 'Alta tasa de errores de API',
        description: `La tasa de errores de la API es ${formatPercentage(performanceSummary.errorRate)}. Verifique la conectividad y las credenciales de la API.`,
        severity: 'critical'
      });
    }
    
    // Añadir issues como recomendaciones
    issues.forEach(issue => {
      if (!issue.resolved) {
        result?.push({
          id: `issue-${issue.id}`,
          title: issue.title,
          description: issue.description,
          severity: issue.severity
        });
      }
    });
    
    return result;
  }, [performanceSummary, issues, config, onConfigChange]);
  
  if (recommendations.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4">
        <h3 className="text-green-800 text-lg font-medium mb-2">
          ✅ Rendimiento óptimo
        </h3>
        <p className="text-green-700">
          No se han detectado problemas de rendimiento. El Field Mapper está funcionando de manera óptima.
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-medium">Recomendaciones de optimización</h3>
      
      {recommendations.map(recommendation => (
        <div 
          key={recommendation.id}
          className={`border rounded-md p-4 ${
            recommendation.severity === 'critical' 
              ? 'bg-red-50 border-red-200' 
              : recommendation.severity === 'warning'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-blue-50 border-blue-200'
          }`}
        >
          <h4 className={`font-medium ${
            recommendation.severity === 'critical' 
              ? 'text-red-800' 
              : recommendation.severity === 'warning'
                ? 'text-yellow-800'
                : 'text-blue-800'
          }`}>
            {recommendation.title}
          </h4>
          
          <p className={`mt-1 ${
            recommendation.severity === 'critical' 
              ? 'text-red-700' 
              : recommendation.severity === 'warning'
                ? 'text-yellow-700'
                : 'text-blue-700'
          }`}>
            {recommendation.description}
          </p>
          
          {recommendation.action && (
            <button
              onClick={recommendation.onClick}
              className={`mt-2 px-3 py-1 text-sm font-medium rounded-md ${
                recommendation.severity === 'critical' 
                  ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                  : recommendation.severity === 'warning'
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
              }`}
            >
              {recommendation.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
