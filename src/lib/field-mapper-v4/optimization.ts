/**
 * Sistema de optimización y recomendaciones
 * 
 * Analiza los resultados de los benchmarks y proporciona
 * recomendaciones para optimizar el rendimiento del sistema de transformaciones.
 */

import { BenchmarkResult } from './benchmark';
import { transformationCache, CacheSettings, CacheStats } from './cache';

// Umbrales para clasificar mejoras
const IMPROVEMENT_THRESHOLDS = {
  HIGH: 50, // > 50% de mejora
  MEDIUM: 20, // > 20% de mejora
  LOW: 5, // > 5% de mejora
};

// Tipos de recomendaciones
export enum RecommendationType {
  INCREASE_TTL = 'increase_ttl',
  INCREASE_CAPACITY = 'increase_capacity',
  DECREASE_TTL = 'decrease_ttl',
  DECREASE_CAPACITY = 'decrease_capacity',
  PRIORITIZE_CACHING = 'prioritize_caching',
  SKIP_CACHING = 'skip_caching',
  OPTIMIZE_TRANSFORMATION = 'optimize_transformation',
  PRECALCULATE_VALUES = 'precalculate_values',
}

// Impacto de la recomendación
export enum RecommendationImpact {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

// Recomendación de optimización
export interface Recommendation {
  type: RecommendationType;
  impact: RecommendationImpact;
  transformationId?: string;
  transformationName?: string;
  description: string;
  suggestedValue?: number;
  currentValue?: number;
}

// Resumen de análisis
export interface OptimizationSummary {
  overallPerformance: {
    averageImprovement: number;
    bestImprovement: number;
    bestTransformationName: string;
    transformationsAnalyzed: number;
    worstTransformationName?: string;
  };
  cacheStats: {
    size: number;
    capacity: number;
    hits: number;
    misses: number;
    hitRate: number;
  };
  recommendations: Recommendation[];
}

/**
 * Analiza los resultados de un benchmark y devuelve un resumen de optimización
 * 
 * @param results - Resultados del benchmark
 * @param cacheStats - Estadísticas actuales del caché
 * @returns Resumen de optimización con recomendaciones
 */
export function analyzeResults(
  results: BenchmarkResult[], 
  cacheStats: CacheStats = transformationCache.getStats()
): OptimizationSummary {
  // Calcular mejoras de rendimiento
  const improvements: { 
    transformationId: string; 
    transformationName: string; 
    improvement: number;
  }[] = [];
  
  // Procesar resultados en pares (con/sin caché)
  for (let i = 0; i < results.length; i += 2) {
    const withoutCache = results[i].withCache ? results[i+1] : results[i];
    const withCache = results[i].withCache ? results[i] : results[i+1];
    
    if (withoutCache && withCache) {
      const improvement = ((withoutCache.averageTime - withCache.averageTime) / withoutCache.averageTime) * 100;
      improvements.push({
        transformationId: withCache.transformationId,
        transformationName: withCache.transformationName,
        improvement
      });
    }
  }
  
  // Estadísticas de la caché
  const cacheSettings = transformationCache.getSettings();
  
  // Ordenar por mejora
  improvements.sort((a, b) => b.improvement - a.improvement);
  
  // Calcular estadísticas generales
  const bestImprovement = improvements.length > 0 ? improvements[0].improvement : 0;
  const bestTransformationName = improvements.length > 0 ? improvements[0].transformationName : '';
  
  // Obtener la transformación con peor rendimiento (si hay alguna)
  const worstTransformation = improvements.length > 0 ? 
    improvements[improvements.length - 1] : null;
  
  const averageImprovement = improvements.reduce((sum, item) => sum + item.improvement, 0) / 
                             (improvements.length || 1);
  
  // Generar recomendaciones
  const recommendations: Recommendation[] = [];
  
  // Recomendaciones basadas en mejoras de rendimiento
  improvements.forEach(({ transformationId, transformationName, improvement }) => {
    if (improvement > IMPROVEMENT_THRESHOLDS.HIGH) {
      recommendations.push({
        type: RecommendationType.PRIORITIZE_CACHING,
        impact: RecommendationImpact.HIGH,
        transformationId,
        transformationName,
        description: `La transformación "${transformationName}" se beneficia enormemente de la caché (${improvement.toFixed(2)}% más rápida). Considere darle prioridad en la caché.`
      });
    } else if (improvement < IMPROVEMENT_THRESHOLDS.LOW) {
      recommendations.push({
        type: RecommendationType.SKIP_CACHING,
        impact: RecommendationImpact.LOW,
        transformationId,
        transformationName,
        description: `La transformación "${transformationName}" apenas mejora con caché (solo ${improvement.toFixed(2)}%). Considere omitir el caché para esta transformación.`
      });
    }
  });
  
  // Recomendaciones basadas en estadísticas de la caché
  if (cacheStats.hitRate < 0.5 && cacheStats.size >= cacheSettings.capacity * 0.9) {
    recommendations.push({
      type: RecommendationType.INCREASE_CAPACITY,
      impact: RecommendationImpact.MEDIUM,
      description: 'La caché está casi llena y la tasa de aciertos es baja. Considere aumentar la capacidad de la caché.',
      currentValue: cacheSettings.capacity,
      suggestedValue: Math.floor(cacheSettings.capacity * 1.5)
    });
  }
  
  if (cacheStats.hitRate < 0.3) {
    recommendations.push({
      type: RecommendationType.INCREASE_TTL,
      impact: RecommendationImpact.MEDIUM,
      description: 'La tasa de aciertos es muy baja. Considere aumentar el TTL para mantener los elementos en caché por más tiempo.',
      currentValue: cacheSettings.ttl,
      suggestedValue: cacheSettings.ttl * 2
    });
  }
  
  if (cacheStats.hitRate > 0.9 && cacheStats.size < cacheSettings.capacity * 0.5) {
    recommendations.push({
      type: RecommendationType.DECREASE_CAPACITY,
      impact: RecommendationImpact.LOW,
      description: 'La caché tiene una alta tasa de aciertos pero está utilizando menos del 50% de su capacidad. Podría reducir la capacidad para ahorrar memoria.',
      currentValue: cacheSettings.capacity,
      suggestedValue: Math.max(100, Math.floor(cacheStats.size * 1.5))
    });
  }
  
  // Construir y devolver el resumen
  return {
    overallPerformance: {
      averageImprovement,
      bestImprovement,
      bestTransformationName,
      transformationsAnalyzed: improvements.length,
      worstTransformationName: worstTransformation ? worstTransformation.transformationName : undefined
    },
    cacheStats: {
      size: cacheStats.size,
      capacity: cacheSettings.capacity,
      hits: cacheStats.hits,
      misses: cacheStats.misses,
      hitRate: cacheStats.hitRate
    },
    recommendations
  };
}

/**
 * Aplica una configuración de caché recomendada
 * 
 * @param settings - Configuración a aplicar
 */
export function applyRecommendedSettings(settings: Partial<CacheSettings>): void {
  transformationCache.updateSettings(settings);
}

/**
 * Optimiza automáticamente la caché basada en los resultados del benchmark
 * 
 * @param results - Resultados del benchmark
 * @returns La configuración aplicada
 */
export function autoOptimize(results: BenchmarkResult[]): CacheSettings {
  const analysis = analyzeResults(results);
  const currentSettings = transformationCache.getSettings();
  const newSettings: Partial<CacheSettings> = {};
  
  // Aplicar recomendaciones prioritarias
  for (const rec of analysis.recommendations) {
    switch (rec.type) {
      case RecommendationType.INCREASE_CAPACITY:
        newSettings.capacity = rec.suggestedValue;
        break;
      case RecommendationType.INCREASE_TTL:
        newSettings.ttl = rec.suggestedValue;
        break;
      case RecommendationType.DECREASE_CAPACITY:
        // Solo aplicar si el impacto no es alto
        if (rec.impact !== RecommendationImpact.HIGH) {
          newSettings.capacity = rec.suggestedValue;
        }
        break;
      case RecommendationType.DECREASE_TTL:
        // Solo aplicar si el impacto no es alto
        if (rec.impact !== RecommendationImpact.HIGH) {
          newSettings.ttl = rec.suggestedValue;
        }
        break;
    }
  }
  
  // Aplicar cambios
  transformationCache.updateSettings(newSettings);
  
  // Devolver configuración actualizada
  return {
    ...currentSettings,
    ...newSettings
  };
}
